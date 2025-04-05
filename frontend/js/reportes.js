document.addEventListener("DOMContentLoaded", function() {
    const reporteForm = document.querySelector("form");

    reporteForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("ubicacion", document.getElementById("ubicacion").value);
        formData.append("descripcion", document.getElementById("descripcion").value);
        formData.append("evidencia", document.getElementById("evidencia").files[0]);
        formData.append("idUsuario", "USR001"); // Cambia esto por el usuario real

        try {
            const response = await fetch("http://localhost:5000/api/reportes", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Reporte enviado con éxito.");
                window.location.reload();
            } else {
                alert(data.msg || "Error al enviar el reporte.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema con la solicitud.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const reporteForm = document.getElementById("reporteForm");

    if (!token) {
        alert("Debes iniciar sesión para realizar un reporte.");
        window.location.href = "login.html";
        return;
    }

    // Si el token es un JWT, puedes decodificarlo para obtener el ID del usuario
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.ID_Usuario; // Asegúrate de que este campo esté en el token

    reporteForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("ubicacion", document.getElementById("ubicacion").value);
        formData.append("descripcion", document.getElementById("descripcion").value);
        formData.append("evidencia", document.getElementById("evidencia").files[0]);
        formData.append("idUsuario", userId);

        try {
            const response = await fetch("http://localhost:5000/api/reportes", {
                method: "POST",
                headers: {
                    "x-auth-token": token // Envío del token en el encabezado requerido
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Reporte enviado con éxito.");
                window.location.reload();
            } else {
                alert(data.msg || "Error al enviar el reporte.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema con la solicitud.");
        }
    });
});

