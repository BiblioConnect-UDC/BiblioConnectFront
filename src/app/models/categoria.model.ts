export class Categoria {
  id: number = 0;
  nombre: string = '';

  constructor(data?: Partial<Categoria>) {
    this.id = data?.id ?? 0;
    this.nombre = data?.nombre ?? '';
  }
}

