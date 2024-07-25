import { login, register } from "./supabase.js";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-login-register');
    const toggleLink = document.getElementById('toggle-link');
    const registerFields = document.getElementById('register-fields');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    let isLogin = true;

    toggleLink.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = 'Iniciar Sesión';
            submitButton.textContent = 'Ingresar';
            toggleLink.textContent = '¿No tienes una cuenta? Regístrate';
            registerFields.style.display = 'none';
        } else {
            formTitle.textContent = 'Registrarse';
            submitButton.textContent = 'Registrarse';
            toggleLink.textContent = '¿Ya tienes una cuenta? Inicia sesión';
            registerFields.style.display = 'block';
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = form.username.value;
        const password = form.password.value;
        if (isLogin) {
            await login(username, password);
        } else {
            const nombre = form.nombre.value;
            const apellido = form.apellido.value;
            await register(username, password, nombre, apellido);
        }
    });
})