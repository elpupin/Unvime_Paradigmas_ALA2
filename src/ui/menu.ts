import rl from 'readline-sync';

import { agregar, obtenerTodas, buscarPorTitulo } from '../data/tareas';

import { agregar, obtenerTodas, buscarPorTitulo, Tarea } from '../data/tareas';

export function menuPrincipal(): void {
    console.log('\n1. Agregar tarea');
    console.log('2. Buscar tareas');
    console.log('3. Mostrar tareas');
    console.log('0. Salir');
    
    const opcion: string = rl.question('Seleccione una opcion: ');
    console.clear();
    
    switch (opcion) {
        case '1':
            agregarTarea();
            break;
        case '2':
            buscarTareas();
            break;
        case '3':
            mostrarTareas();
            break;
        case '0':
            console.log('Saliendo de la aplicación...');
            process.exit(0);
        default:
            console.log('Opción no válida. Intente nuevamente.');
            menuPrincipal();
            break;
    }
}

function validarTitulo(titulo: string): string {
    while (titulo === '' || titulo === null || titulo === undefined) {
        console.log('El titulo no puede estar vacío. Ingrese un titulo válido.');
        titulo = rl.question('Ingrese el titulo de la tarea: ');
    }
    return titulo;
}

function validarDificultad(dificultad: number): number {
    while (isNaN(dificultad) || dificultad < 1 || dificultad > 3) {
        console.log('La dificultad debe ser un número entre 1 y 3. Ingrese una dificultad válida.');
        dificultad = parseInt(rl.question('Ingrese la dificultad de la tarea (1-3): '));
    }
    return dificultad;
}

function agregarTarea(): void {
    let titulo: string = rl.question('Ingrese el titulo de la tarea: ');
    titulo = validarTitulo(titulo);
    
    const descripcion: string = rl.question('Ingrese la descripcion de la tarea: ');
    const fechaVencimiento: string = rl.question('Ingrese la fecha de vencimiento de la tarea (YYYY-MM-DD): ');
    
    console.log("Seleccione la dificultad de la tarea:");
    console.log("1. Fácil");
    console.log("2. Media");
    console.log("3. Difícil");
    
    let dificultad: number = parseInt(rl.question('> '));
    dificultad = validarDificultad(dificultad);

    const nuevaTarea: Tarea = {
        titulo: titulo,
        descripcion: descripcion,
        estado: 'Pendiente',
        fechaCreacion: new Date(),
        fechaVencimiento: fechaVencimiento,
        dificultad: dificultad
    };
    
    agregar(nuevaTarea);
    
    console.clear();
    console.log(`Tarea agregada: ${titulo}`);
    menuPrincipal();
}

function editarTarea(tareaSeleccionada: Tarea): void {
    const titulo = rl.question(`Ingrese el nuevo titulo de la tarea (actual: ${tareaSeleccionada.titulo}): `);
    const descripcion = rl.question(`Ingrese la nueva descripcion de la tarea (actual: ${tareaSeleccionada.descripcion}): `);
    const fechaVencimiento = rl.question(`Ingrese la nueva fecha de vencimiento de la tarea (actual: ${tareaSeleccionada.fechaVencimiento}): `);
    
    console.log("Seleccione la nueva dificultad de la tarea:");
    console.log("1. Fácil");
    console.log("2. Media");
    console.log("3. Difícil");
    const dificultadInput = rl.question('> ');

    tareaSeleccionada.titulo = titulo || tareaSeleccionada.titulo;
    tareaSeleccionada.descripcion = descripcion || tareaSeleccionada.descripcion;
    tareaSeleccionada.fechaVencimiento = fechaVencimiento || tareaSeleccionada.fechaVencimiento;
    
    if (dificultadInput !== '') {
        let dificultad = parseInt(dificultadInput);
        dificultad = validarDificultad(dificultad);
        tareaSeleccionada.dificultad = dificultad;
    }

    console.clear();
    console.log('Tarea editada exitosamente.');
}

function buscarTareas(): void {
    const termino = rl.question('Ingrese el termino de busqueda: ');
    console.clear();

    const resultados: Tarea[] = buscarPorTitulo(termino);
    
    console.log(`Resultados de búsqueda para "${termino}".`);
    let contador = 1;
    
    for (let i = 0; i < resultados.length; i++) {
        console.log(`${contador}. ${resultados[i].titulo}`);
        contador++;
    }

    if (resultados.length === 0) {
        console.log('No se encontraron tareas con ese termino.');
    } else {
        console.log('\n¿Desea ver los detalles de alguna tarea? (Ingrese el numero o 0 para volver)');
        const opcion = rl.question('> ');
        const index = parseInt(opcion) - 1;

        if (index >= 0 && index < resultados.length) {
            const tareaSeleccionada = resultados[index];
            console.clear();

            console.log(`Título: ${tareaSeleccionada.titulo}`);
            console.log(`Descripción: ${tareaSeleccionada.descripcion}`);
            console.log(`Fecha de creación: ${tareaSeleccionada.fechaCreacion}`);
            console.log(`Fecha de vencimiento: ${tareaSeleccionada.fechaVencimiento}`);
            console.log(`Estado: ${tareaSeleccionada.estado}`);
            console.log(`Dificultad: ${tareaSeleccionada.dificultad}`);

            console.log('\nDesea editar la tarea? (s/n)');
            const confirmacion = rl.question('> ');
            
            if (confirmacion === 's') {
                editarTarea(tareaSeleccionada);
            } else if (confirmacion !== 'n') {
                console.log('Opción no válida.');
            }
        } else if (opcion !== '0') {
            console.log('Opción no válida.');
        }
    }
    
    console.log('\nPresione Enter para continuar...');
    rl.question('');
    console.clear();
    menuPrincipal();
}

function mostrarTareas(): void {
    console.clear();

    const lista: Tarea[] = obtenerTodas();
    console.log('--- LISTA DE TAREAS ---');
    console.log('¿Que tareas deseas ver?');
    console.log('1. Todas las tareas');
    console.log('2. Tareas pendientes');
    console.log('3. Tareas en progreso');
    console.log('4. Tareas completadas');
    console.log('0. Volver al menu principal');
    const decision = rl.question('> ');
    
    switch (decision) {
        case '1': {
            for (let i = 0; i < lista.length; i++) {
                console.log(`${i + 1}. [${lista[i].estado}] ${lista[i].titulo}`);
            }
            if (lista.length === 0) {
                console.log('No hay tareas registradas');
            }
            console.log('\nPresione Enter para continuar...');
            rl.question('');
            console.clear();
            menuPrincipal();
            break;
        }

        case '2': {
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].estado === 'Pendiente') {
                    console.log(`${i + 1}. [${lista[i].estado}] ${lista[i].titulo}`);
                }
            }
            console.log('\nPresione Enter para continuar...');
            rl.question('');
            console.clear();
            menuPrincipal();
            break;
        }

        case '3': {
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].estado === 'En progreso') {
                    console.log(`${i + 1}. [${lista[i].estado}] ${lista[i].titulo}`);
                }
            }
            console.log('\nPresione Enter para continuar...');
            rl.question('');
            console.clear();
            menuPrincipal();
            break;
        }

        case '4': {
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].estado === 'Completada') {
                    console.log(`${i + 1}. [${lista[i].estado}] ${lista[i].titulo}`);
                }
            }
            console.log('\nPresione Enter para continuar...');
            rl.question('');
            console.clear();
            menuPrincipal();
            break;
        }

        case '0': {
            console.clear();
            menuPrincipal();
            break;
        }

        default: {
            console.log('Opción no válida.');
            console.log('\nPresione Enter para continuar...');
            rl.question('');
            console.clear();
            menuPrincipal();
            break;
        }
    }
}