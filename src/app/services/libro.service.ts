// src/app/services/libro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Libro, CreateLibroRequest, LibroCompleto } from '../models/libro.models';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  // Obtener todos los libros
  getAllBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  // Obtener libro por ID
  getBookById(id: number): Observable<LibroCompleto> {
    return this.http.get<LibroCompleto>(`${this.apiUrl}/${id}`);
  }

  // Crear libro
  createBook(libro: CreateLibroRequest): Observable<LibroCompleto> {
    return this.http.post<LibroCompleto>(this.apiUrl, libro);
  }

  // Actualizar libro
  updateBook(id: number, libro: CreateLibroRequest): Observable<LibroCompleto> {
    return this.http.put<LibroCompleto>(`${this.apiUrl}/${id}`, libro);
  }

  // Eliminar libro
  deleteBook(id: number): Observable<LibroCompleto> {
    return this.http.delete<LibroCompleto>(`${this.apiUrl}/${id}`);
  }
}