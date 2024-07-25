import { getWorker, addWork } from "./supabase.js";

const populateEmployeeSelect = async () => {
    const selectElement = document.getElementById('id-empleado');
    const workers = await getWorker();

    selectElement.innerHTML = '<option value="">Selecciona un empleado</option>';

    workers.forEach(worker => {
        const option = document.createElement('option');
        option.value = worker.id;
        option.textContent = `${worker.nombre} ${worker.apellido}`;
        selectElement.appendChild(option);
    });
};

document.addEventListener('DOMContentLoaded', populateEmployeeSelect);

document.getElementById("formulario-trabajo").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nombreTrabajo = document.getElementById('nombre-trabajo').value;
    const fechaAsignacion = document.getElementById('fecha-asignacion').value;
    const fechaLimite = document.getElementById('fecha-limite').value;
    const idUser = document.getElementById("id-empleado").value;
    const desc = document.getElementById("descripcion").value;

    if (!nombreTrabajo || !fechaAsignacion || !fechaLimite || !idUser || !desc) {
        Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
        return;
    }

    try {
        const result = await addWork(nombreTrabajo, fechaAsignacion, fechaLimite, desc, idUser);
        Swal.fire({
            title: 'Trabajo Agregado',
            text: 'El trabajo se ha agregado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
        });

        document.getElementById("formulario-trabajo").reset();
        
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo agregar el trabajo',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
        });
    }
});
