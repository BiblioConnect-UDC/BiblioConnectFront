import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Crear formulario reactivo
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordMatchValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Getter para acceder a los controles del formulario
   */
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const { nombre, email, username, password } = this.registerForm.value;

    this.authService.register({
      nombre,
      email,
      username,
      password
    }).subscribe({
      next: (response) => {
        console.log('Registro exitoso');
        this.success = 'Usuario registrado exitosamente. Redirigiendo a login...';
        this.loading = false;
        
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.error = error.message || 'Error al registrar usuario';
        this.loading = false;
      }
    });
  }

  /**
   * Navega a la página de login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Limpia el formulario
   */
  resetForm(): void {
    this.registerForm.reset();
    this.submitted = false;
    this.error = '';
    this.success = '';
  }
}
