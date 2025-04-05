document.addEventListener("DOMContentLoaded", async () => {
    const reportesContainer = document.getElementById("reportes-container");

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No tienes permiso para acceder aquí.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch("http://localhost:5000/api/reportes/pendientes", {
            headers: { "x-auth-token": token }
        });

        const responseText = await response.text();
        console.log("Respuesta del servidor:", responseText);

        if (response.ok) {
            const reportes = JSON.parse(responseText);
            reportes.forEach(reporte => {
                const card = document.createElement("div");
                card.classList.add("report-card-blur");

                const userInfoDiv = document.createElement("div");
                userInfoDiv.classList.add("user-info");

                if (reporte.ID_Usuario) {
                    const idUsuarioParrafo = document.createElement("p");
                    idUsuarioParrafo.innerHTML = `<strong>ID Usuario:</strong> <span class="user-id">${reporte.ID_Usuario}</span>`;
                    userInfoDiv.appendChild(idUsuarioParrafo);
                }
                if (reporte.Nombre_Usuario) {
                    const nombreUsuarioParrafo = document.createElement("p");
                    nombreUsuarioParrafo.innerHTML = `<strong>Nombre:</strong> <span class="user-name">${reporte.Nombre_Usuario}</span>`;
                    userInfoDiv.appendChild(nombreUsuarioParrafo);
                }
                if (reporte.Apellido_Usuario) {
                    const apellidoUsuarioParrafo = document.createElement("p");
                    apellidoUsuarioParrafo.innerHTML = `<strong>Apellido:</strong> <span class="user-lastname">${reporte.Apellido_Usuario}</span>`;
                    userInfoDiv.appendChild(apellidoUsuarioParrafo);
                }

                const reportContentDiv = document.createElement("div");
                reportContentDiv.classList.add("report-content");
                reportContentDiv.innerHTML = `
                    <p><strong>Ubicación:</strong> ${reporte.Ubicacion}</p>
                    <p><strong>Fecha:</strong> ${new Date(reporte.Fecha_Creacion).toLocaleDateString()}</p>
                    <div class="report-image-container">
                        <img src="http://localhost:5000/uploads/${reporte.Evidencia_Imagen}" alt="Evidencia de infracción" class="report-image">
                    </div>
                    <p><strong>Descripción:</strong> ${reporte.Descripcion}</p>
                    <div class="moderator-actions">
                        <button class="approve-btn" data-id="${reporte._id}">Aprobar</button>
                        <button class="reject-btn" data-id="${reporte._id}">Rechazar</button>
                        <button class="sanction-btn" data-reporte-id="${reporte.ID_Reporte}">Sancionar</button>
                    </div>
                `;

                reportContentDiv.prepend(userInfoDiv);
                card.appendChild(reportContentDiv);
                reportesContainer.appendChild(card);
            });

            document.querySelectorAll(".approve-btn").forEach(button => {
                button.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    await actualizarEstadoReporte(button.dataset.id, "Validado");
                });
            });

            document.querySelectorAll(".reject-btn").forEach(button => {
                button.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    await actualizarEstadoReporte(button.dataset.id, "Rechazado");
                });
            });

            document.querySelectorAll(".sanction-btn").forEach(button => {
                button.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    const reporteId = button.dataset.reporteId;
                    const tipoSancion = prompt("Ingrese el tipo de sanción:");
                    const observaciones = prompt("Ingrese las observaciones de la sanción:");
                    if (tipoSancion && observaciones) {
                        await aplicarSancion(reporteId, tipoSancion, observaciones);
                    } else {
                        alert("Debe ingresar el tipo y las observaciones de la sanción.");
                    }
                });
            });

        } else {
            alert("Error al cargar los reportes.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

async function actualizarEstadoReporte(id, estado) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:5000/api/reportes/${id}/actualizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
            },
            body: JSON.stringify({ estado }),
        });

        if (response.ok) {
            alert(`Reporte marcado como ${estado}`);
            location.reload();
        } else {
            alert("Error al actualizar el reporte.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
} 


async function aplicarSancion(idReporte, tipoSancion, observaciones) {
    const token = localStorage.getItem("token");


try {
        const response = await fetch("http://localhost:5000/api/sanciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
            body: JSON.stringify({ idReporte: parseInt(idReporte), tipoSancion, observaciones })
        });

        if (response.ok) {
            alert("Sanción aplicada con éxito.");
            // Opcional: Puedes actualizar la UI o recargar la página
        } else {
            const errorData = await response.json();
            alert(`Error al aplicar la sanción: ${errorData.msg || "Error desconocido"}`);
        }
    } catch (error) {
        console.error("Error al enviar la solicitud de sanción:", error);
        alert("Error al aplicar la sanción.");
    }
}