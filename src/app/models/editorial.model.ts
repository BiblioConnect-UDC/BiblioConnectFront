export class Editorial {
  id: number = 0;
  nombre: string = '';

  constructor(data?: Partial<Editorial>) {
    this.id = data?.id ?? 0;
    this.nombre = data?.nombre ?? '';
  }
}
