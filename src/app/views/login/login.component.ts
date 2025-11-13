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
    this.submitted = true;
    this.error = '';

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login exitoso');
        // Guardar username en localStorage para mostrar en header
        localStorage.setItem('username', username);
        this.loading = false;
        // Redirigir a home después de login exitoso
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.error = error.message || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }

  /**
   * Navega al formulario de registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

}
