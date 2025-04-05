document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("auth-button");

    // Verifica si el usuario tiene sesión iniciada (token almacenado)
    const token = localStorage.getItem("token");

    if (token) {
        // Si hay token, cambiar el botón a "Cerrar sesión"
        authButton.textContent = "Cerrar sesión";
        // Evita que se redirija inmediatamente al login
        authButton.href = "#";

        // Agrega el evento para confirmar y cerrar sesión
        authButton.addEventListener("click", (event) => {
            event.preventDefault();
            if (confirm("¿De verdad desea cerrar sesión?")) {
                // Elimina el token y redirige al login
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
        });
    } else {
        // Si no hay token, mostrar "Iniciar sesión" y mantener el enlace a login
        authButton.textContent = "Iniciar Sesión";
        authButton.href = "login.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("auth-button");
    const reportButton = document.querySelector("nav ul li a[href='reportes.html']"); // Detecta el botón de reportar

    // Verifica si hay un token guardado
    const token = localStorage.getItem("token");

    if (token) {
        // Decodificar el token para obtener el tipo de usuario
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el JWT
        const tipoUsuario = payload.Tipo_Usuario; // Extrae el tipo de usuario

        console.log("Tipo de usuario:", tipoUsuario);

        // Si el usuario es moderador, cambia el botón de "Reportar Infracción"
        if (tipoUsuario === "Moderador" && reportButton) {
            reportButton.textContent = "Reportes por Revisar";
            reportButton.href = "reportes-revisar.html"; // Cambia el enlace
        }

        // Cambia el botón de autenticación a "Cerrar sesión"
        authButton.textContent = "Cerrar sesión";
        authButton.href = "#";

        // Evento para cerrar sesión
        authButton.addEventListener("click", (event) => {
            event.preventDefault();
            if (confirm("¿De verdad desea cerrar sesión?")) {
                localStorage.removeItem("token"); // Elimina el token
                window.location.href = "index.html"; // Redirige a la página principal
            }
        });

    } else {
        // Si no hay sesión, mostrar "Iniciar Sesión"
        authButton.textContent = "Iniciar Sesión";
        authButton.href = "login.html";
    }
});

