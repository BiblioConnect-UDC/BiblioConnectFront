// src/app/services/genero.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Genero } from '../models/libro.models';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  private apiUrl = `${environment.apiUrl}/v1/library/genres`;

  constructor(private http: HttpClient) {}

  getAllGeneros(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.apiUrl);
  }
}