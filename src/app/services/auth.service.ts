import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { RegistrationRequest } from '../models/registrationRequest';
// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
// }



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/v1/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Realiza el login del usuario
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del servidor
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };
    const url = `${this.apiUrl}/login`;
    
    console.log('🔐 Intentando login...', {
      url: url,
      username: username,
      apiUrl: this.apiUrl
    });
    
    return this.http.post<LoginResponse>(url, loginRequest).pipe(
      tap(response => {
        console.log('✅ Login exitoso', response);
        // Guardar token en localStorage
        localStorage.setItem('auth_token', response.token);
        this.tokenSubject.next(response.token);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Registra un nuevo usuario
   * @param request Datos de registro
   * @returns Observable con la respuesta del servidor
   */
  register(request: RegistrationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene el token JWT almacenado
   * @returns Token JWT o null si no existe
   */
  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Obtiene el token actual
   * @returns Token JWT
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si existe un token válido
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    this.tokenSubject.next(null);
    console.log('Token eliminado, usuario deslogueado');
  }

  /**
   * Manejador de errores HTTP
   * @param error Error de HTTP
   * @returns Observable con el error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    console.error('❌ Error completo:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url,
      error: error.error
    });

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
      console.error('Error del cliente (red/navegador):', error.error);
    } else if (error.status === 0) {
      // Error de red o CORS
      errorMessage = 'No se puede conectar con el servidor. Verifica:\n' +
                    '1. Que el backend esté ejecutándose en http://149.130.173.252:8081\n' +
                    '2. Que CORS esté configurado correctamente\n' +
                    '3. Que no haya firewall bloqueando la conexión';
      console.error('⚠️ Error de conexión (Status 0) - Posibles causas:');
      console.error('   - CORS no configurado correctamente');
      console.error('   - Backend no está ejecutándose');
      console.error('   - Firewall bloqueando la conexión');
      console.error('   - URL incorrecta');
    } else {
      // Error del lado del servidor
      if (error.status === 401) {
        errorMessage = 'Credenciales inválidas';
      } else if (error.status === 403) {
        errorMessage = 'Acceso denegado';
      } else if (error.status === 409) {
        errorMessage = 'El usuario ya existe';
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos';
      } else if (error.status === 500) {
        errorMessage = 'Error en el servidor';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica la URL de la API.';
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText || 'Error del servidor'}`;
      }
    }

    console.error('📝 Mensaje de error final:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}