export interface Prestamo {
    id: number;
    libroId: number;
    usuarioId: number;
    fechaPrestamo: Date;
    fechaDevolucionEstimada: Date;
    fechaDevolucionReal?: Date;
    estado: EstadoPrestamo;
    observaciones?: string;
}

export enum EstadoPrestamo {
    ACTIVO = 'ACTIVO',
    DEVUELTO = 'DEVUELTO',
    VENCIDO = 'VENCIDO'
}