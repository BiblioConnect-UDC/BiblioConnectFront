import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  username: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar autenticación inicial
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadUsername();

    // Escuchar cambios en el token
    this.authService.token$
      .pipe(takeUntil(this.destroy$))
      .subscribe(token => {
        this.isAuthenticated = !!token;
        if (this.isAuthenticated) {
          this.loadUsername();
        }
      });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
  /**
   * Carga el nombre de usuario del token o localStorage
   */
  private loadUsername(): void {
    // Obtener nombre de usuario del localStorage o del token
    // Nota: Puedes guardar el username en localStorage al hacer login
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      // Si no está guardado, usa un valor por defecto
      this.username = 'Usuario';
    }
  }

  /**
   * Realiza el logout
   */
  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      localStorage.removeItem('username');
      this.username = '';
      this.isAuthenticated = false;
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
