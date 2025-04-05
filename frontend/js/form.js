document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".report-form form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const ubicacion = document.getElementById("ubicacion").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const evidencia = document.getElementById("evidencia").files[0];
        const token = localStorage.getItem("token");

        if (!ubicacion || !descripcion) {
            alert("Por favor, complete todos los campos requeridos.");
            return;
        }

        const formData = new FormData();
        formData.append("Ubicacion", ubicacion);
        formData.append("Descripcion", descripcion);
        if (evidencia) formData.append("Evidencia_Imagen", evidencia);

        try {
            const response = await fetch("http://127.0.0.1/:5500/routes/reportes.js", {
                method: "POST",
                headers: { "x-auth-token": token },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert("Reporte enviado exitosamente.");
                form.reset();
            } else {
                alert(data.msg || "Error al enviar el reporte.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema con la solicitud.");
        }
    });
});
