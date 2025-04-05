document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, contraseña: password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("tipoUsuario", data.Tipo_Usuario); // 🔹 Guardar el tipo de usuario
                alert("Inicio de sesión exitoso.");
                window.location.href = "index.html"; // Redirigir al home
            } else {
                alert(data.msg || "Error al iniciar sesión.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema con la solicitud.");
        }
    });
});
