// src/app/services/editorial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EditorialEntity } from '../models/libro.models';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {
  private apiUrl = `${environment.apiUrl}/editorials`; // Ajusta si tienes este endpoint

  constructor(private http: HttpClient) {}

  getAllEditorials(): Observable<EditorialEntity[]> {
    return this.http.get<EditorialEntity[]>(this.apiUrl);
  }
}