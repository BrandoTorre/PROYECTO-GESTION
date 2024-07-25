import { getWorker, getWork } from "./supabase.js";

const updateEmployeeList = async () => {
    try {
        const empleados = await getWorker();
        const trabajos = await getWork();

        const listaEmpleados = document.getElementById("lista-empleados");
        listaEmpleados.innerHTML = '';

        const estadoTrabajoMap = new Map();
        trabajos.forEach(trabajo => {
            estadoTrabajoMap.set(trabajo.fk_iduse, trabajo.estado);
        });

        empleados.forEach(empleado => {
            const estadoTrabajo = estadoTrabajoMap.get(empleado.id) || 'No disponible';
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${empleado.nombre}</td>
                <td>${empleado.apellido}</td>
                <td>${empleado.posicion}</td>
                <td>${empleado.departamento}</td>
                <td>${estadoTrabajo}</td>
                ${sessionStorage.getItem('rol') === 'admin' ? 
                `<td><button onclick="eliminarEmpleado(${empleado.id})">Eliminar</button></td>` : 
                '<td></td>'}
            `;
            listaEmpleados.appendChild(fila);
        });
    } catch (error) {
        console.error('Error cargando empleados:', error);
    }
};

document.addEventListener("DOMContentLoaded", updateEmployeeList);

window.eliminarEmpleado = async (id) => {
    console.log(`Eliminar empleado con ID: ${id}`);
};
