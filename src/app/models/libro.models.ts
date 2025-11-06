export interface Libro {
  id: number;
  titulo: string;
  isbn: string;
  editorial: Editorial;
  categoria: string;
}

export interface Editorial {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface CreateLibroRequest {
  titulo: string;
  isbn: string;
  idEditorial: number;
  idCategoria: number;
  estado?: string; 
}

export interface LibroCompleto {
  id?: number;
  titulo: string;
  isbn: string;
  estado: string;
  idEditorial: number;
  idGenero: number;
  editorial?: Editorial;
  genero?: Genero;
}

export interface Genero {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface EditorialEntity {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}