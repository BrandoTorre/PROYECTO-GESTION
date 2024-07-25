import { getWork, updateWorkStatus, getWorker } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const trabajos = await getWork();
        const empleados = await getWorker();

        const tareasCompletadas = trabajos.filter(trabajo => trabajo.estado === 'completado').length;
        const tareasNoCompletadas = trabajos.filter(trabajo => trabajo.estado !== 'completado').length;

        const ctx = document.getElementById('progresoGrafico').getContext('2d');
        const progresoGrafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Completados', 'No Completados'],
                datasets: [{
                    label: 'Progreso de Trabajos',
                    data: [tareasCompletadas, tareasNoCompletadas],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const actualizarGrafico = () => {
            const tareasCompletadas = trabajos.filter(trabajo => trabajo.estado === 'completado').length;
            const tareasNoCompletadas = trabajos.filter(trabajo => trabajo.estado !== 'completado').length;
            progresoGrafico.data.datasets[0].data = [tareasCompletadas, tareasNoCompletadas];
            progresoGrafico.update();
        };

        const empleadoMap = new Map(empleados.map(emp => [emp.id, `${emp.nombre} ${emp.apellido}`]));

        trabajos.forEach(trabajo => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${empleadoMap.get(trabajo.fk_iduse) || 'Desconocido'}</td> <!-- Nombre del empleado -->
                <td>${trabajo.nombre_trabajo}</td>
                <td>${trabajo.fecha_asignacion}</td>
                <td>${trabajo.fecha_limite}</td>
                <td>${trabajo.descripcion}</td>
                <td>${trabajo.estado}</td>
                ${sessionStorage.getItem('rol') === 'admin' ? 
                `<td><button onclick="eliminarTrabajo(${trabajo.id})">Eliminar</button></td>` : 
                `<td><button onclick="cambiarEstado(${trabajo.id}, '${trabajo.estado}')">Cambiar Estado</button></td>`}
            `;
            document.getElementById("lista-tareas").appendChild(fila);
        });

        window.cambiarEstado = async (id, estadoActual) => {
            const nuevoEstado = estadoActual === 'completado' ? 'no completado' : 'completado';
            await updateWorkStatus(id, nuevoEstado);
            const trabajo = trabajos.find(t => t.id === id);
            trabajo.estado = nuevoEstado;
            actualizarGrafico();

            const event = new CustomEvent('updateEmployeeList', { detail: { employeeId: trabajo.fk_iduse } });
            window.dispatchEvent(event);

            location.reload();
        };

        window.eliminarTrabajo = async (id) => {
            console.log(`Eliminar trabajo con ID: ${id}`);
        };
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
});
