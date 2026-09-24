export interface Tarea {
    titulo: string;
    descripcion: string;
    estado: 'Pendiente' | 'En progreso' | 'Completada';
    fechaCreacion: Date;
    fechaVencimiento: string;
    dificultad: number;
}

export const tareas: Tarea[] = [];

export function agregar(nuevaTarea: Tarea): void {
    tareas.push(nuevaTarea);
}

export function obtenerTodas(): Tarea[] {
    return tareas;
}

export function buscarPorTitulo(termino: string): Tarea[] {

    const resultados: Tarea[] = [];
    const terminoBusqueda: string = termino.toLowerCase();
    
    for (let i = 0; i < tareas.length; i++) {
        const tituloTarea: string = tareas[i].titulo.toLowerCase();
        
        if (tituloTarea.indexOf(terminoBusqueda) !== -1) {
            resultados.push(tareas[i]);
        }
    }
    
    return resultados;
}