import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Redirigir a home si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    // Crear formulario
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  /**
   * Getter para acceder a los controles del formulario
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    console.log('🚀 onSubmit() iniciado');
    
    this.submitted = true;
    this.error = '';

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      console.log('❌ Formulario inválido', this.loginForm.errors);
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;
    
    console.log('📝 Datos del formulario:', { username, passwordLength: password?.length });
    console.log('🔄 Llamando a authService.login()...');

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso en componente', response);
        // Guardar username en localStorage para mostrar en header
        localStorage.setItem('username', username);
        this.loading = false;
        // Redirigir a home después de login exitoso
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Error capturado en componente:', error);
        console.error('❌ Error tipo:', typeof error);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));
        this.error = error.message || 'Error al iniciar sesión';
        this.loading = false;
      },
      complete: () => {
        console.log('✔️ Observable completado');
      }
    });
    
    console.log('⏳ Después de subscribe (asíncrono)');
  }

  /**
   * Navega al formulario de registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

}
