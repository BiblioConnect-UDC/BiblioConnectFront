import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
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
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        // Guardar token en localStorage
        localStorage.setItem('auth_token', response.token);
        this.tokenSubject.next(response.token);
        console.log('Login exitoso');
      }),
      catchError(this.handleError)
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

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 401) {
        errorMessage = 'Credenciales inválidas';
      } else if (error.status === 409) {
        errorMessage = 'El usuario ya existe';
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos';
      } else if (error.status === 500) {
        errorMessage = 'Error en el servidor';
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Error de autenticación:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}