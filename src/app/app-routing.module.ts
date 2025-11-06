import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LibroFormComponent } from './Components/libro-form/libro-form.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'libro-form', component: LibroFormComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
