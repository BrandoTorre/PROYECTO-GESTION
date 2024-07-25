import { addWorker } from "./supabase.js";

document.getElementById("formulario-empleado").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const posicion = document.getElementById("posicion").value;
    const departamento = document.getElementById("departamento").value;

    try {
        const result = await addWorker(nombre, apellido, posicion, departamento);
        Swal.fire({
            title: 'Empleado Agregado',
            text: 'El empleado se ha agregado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
        });
        
        document.getElementById("formulario-trabajo").reset();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo agregar el empleado',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
        });
    }
});
