import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { LibroFormComponent } from './Components/libro-form/libro-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterFormComponent } from './Components/register-form/register-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'libro-form', component: LibroFormComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterFormComponent },
  { path: '**', redirectTo: 'login' } //Esta es una ruta wildcard  para volver a login si la ruta ingresada no existe
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
