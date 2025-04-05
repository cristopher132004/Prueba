registroForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre_usuario = document.getElementById("nombre_usuario").value.trim();
    const apellido_usuario = document.getElementById("apellido_usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Verifica si los datos están siendo obtenidos correctamente
    console.log({ nombre_usuario, apellido_usuario, email, password });

    if (!nombre_usuario || !apellido_usuario || !email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/usuarios/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Nombre_Usuario: nombre_usuario,
                Apellido_Usuario: apellido_usuario,
                Tipo_Usuario: "Usuario",
                Email: email,
                Contraseña: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Usuario registrado exitosamente.");
            window.location.href = "login.html";
        } else {
            alert(data.msg || "Error al registrar usuario.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema con la solicitud de registro.");
    }
});
