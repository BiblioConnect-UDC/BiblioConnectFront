// src/app/views/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibroService } from '../../services/libro.service';
import { Libro, LibroCompleto } from '../../models/libro.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  libros: Libro[] = [];
  librosFiltrados: Libro[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  constructor(
    private libroService: LibroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.loading = true;
    this.libroService.getAllBooks().subscribe({
      next: (libros) => {
        this.libros = libros;
        this.librosFiltrados = libros;
        this.loading = false;
        console.log('Libros cargados:', libros.length);
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.loading = false;
        alert('Error al cargar los libros');
      }
    });
  }

  buscarLibros(): void {
    if (!this.searchTerm.trim()) {
      this.librosFiltrados = this.libros;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.librosFiltrados = this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(term) ||
      libro.isbn.toLowerCase().includes(term) ||
      libro.editorial.nombre.toLowerCase().includes(term) ||
      libro.categoria.toLowerCase().includes(term)
    );
  }

  irACrearLibro(): void {
    this.router.navigate(['/libro-form']);
  }

  irAEditarLibro(id: number): void {
    this.router.navigate(['libro-form'], { queryParams: { id: id } });
  }

  verDetalle(id: number): void {
    this.router.navigate(['libro-detalle'], { queryParams: { id: id } });
  }

  eliminarLibro(libro: Libro): void {
    console.log('Elinando libro con ID:', libro.id);
    if (!libro.id) {
      alert ('ID de libro incorrecto');
      return;
    }
    if(confirm(`¿Estás seguro de que deseas eliminar el libro "${libro.titulo}"?`)) {
      this.loading = true;
      this.libroService.deleteBook(libro.id).subscribe({
        next: () => {
          console.log(`libro "${libro.titulo} con "${libro.titulo}"" eliminado correctamente`);
        this.libros = this.libros.filter(l => l.id !== libro.id);
        this.buscarLibros();
        this.loading = false;
        alert(`Libro eliminado correctamente`);
        },
        error: (error) => {
          console.error('Error al eliminar libro:', error);
          this.loading = false;
          alert('Error al eliminar el libro');
        }
      });
  }
}
}