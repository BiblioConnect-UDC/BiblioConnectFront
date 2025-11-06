export class CreateLibroRequest {
  id: number;
  titulo: string;
  isbn: string;
  estado: string;
  idEditorial: number;
  idCategoria: number;

  constructor(data?: Partial<CreateLibroRequest>) {
    this.id = data?.id ?? 0;
    this.titulo = data?.titulo ?? '';
    this.isbn = data?.isbn ?? '';
    this.estado = data?.estado ?? '';
    this.idEditorial = data?.idEditorial ?? 0;
    this.idCategoria = data?.idCategoria ?? 0;
  }
}
