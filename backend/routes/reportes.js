const express = require("express");
const multer = require("multer");
const path = require("path");
const Reporte = require("../models/Reporte");
const Validacion = require("../models/Validacion");
const { auth } = require("../middleware/auth"); // Desestructura correctamente
 
const router = express.Router();
 
// Middleware para verificar si el usuario es moderador
const verificarModerador = (req, res, next) => {
    // Suponiendo que el rol del usuario se encuentra en req.user.rol y que el rol de moderador es "moderador"
    if (req.user && req.user.rol === "moderador") {
        return next();
    } else {
        return res.status(403).json({ msg: "Acceso denegado. Se requieren permisos de moderador." });
    }
};
 
// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
 
// Ruta para crear un nuevo reporte (requiere autenticación)
router.post("/", auth, upload.single("evidencia"), async (req, res) => {
    try {
        console.log("📌 Nueva solicitud recibida en /api/reportes");
 
        const { ubicacion, descripcion } = req.body;
        const evidencia = req.file ? req.file.filename : null;
        const idUsuario = req.user.ID_Usuario;
 
        if (!ubicacion || !descripcion) {
            return res.status(400).json({ msg: "Ubicación y descripción son obligatorios." });
        }
 
        const totalReportes = await Reporte.countDocuments();
 
        const nuevoReporte = new Reporte({
            ID_Reporte: totalReportes + 1,
            ID_Usuario: idUsuario,
            Ubicacion: ubicacion,
            Descripcion: descripcion,
            Evidencia_Imagen: evidencia,
            Estado: "Pendiente",
            Fecha_Creacion: new Date(),
            Comentarios_Testigos: ""
        });
 
        await nuevoReporte.save();
        console.log("✅ Reporte guardado correctamente:", nuevoReporte);
 
        res.status(201).json({ msg: "Reporte enviado con éxito", reporte: nuevoReporte });
 
    } catch (error) {
        console.error("❌ Error al guardar el reporte:", error);
        res.status(500).json({ msg: "Error del servidor" });
    }
});
 
// Ruta para obtener reportes pendientes (visible solo para moderadores)
router.get("/pendientes", auth, verificarModerador, async (req, res) => {
    try {
        const reportesPendientes = await Reporte.find({ Estatus: "Pendiente" });
        console.log("📑 Reportes pendientes encontrados:", reportesPendientes);
        res.json(reportesPendientes);
    } catch (error) {
        console.error("❌ Error al obtener reportes pendientes:", error);
        res.status(500).json({ msg: "Error al obtener reportes pendientes" });
    }
});
 
// Ruta para actualizar el estado de un reporte
router.put("/:id/actualizar", auth, async (req, res) => {
    const { estado } = req.body;
    const reporteId = req.params.id;
 
    try {
        const reporte = await Reporte.findByIdAndUpdate(
            reporteId,
            { Estado: estado },
            { new: true }
        );
 
        if (!reporte) {
            return res.status(404).json({ msg: "Reporte no encontrado." });
        }
 
        if (estado === "Validado") {
            const nuevoRegistroValidacion = new Validacion({
                ID_Reporte: reporte._id,
                ID_Moderador: req.user.ID_Usuario,
                Resultado: "Aprobado",
            });
 
            try {
                const validacionGuardada = await nuevoRegistroValidacion.save();
                console.log("Reporte aprobado y registrado en Validaciones:", validacionGuardada);
            } catch (error) {
                console.error("Error al guardar la validación:", error);
                return res.status(500).json({ msg: "Error al guardar la validación." });
            }
        } else if (estado === "Rechazado") {
            console.log(`Reporte con ID ${reporteId} ha sido rechazado.`);
        }
 
        res.json({ msg: `Reporte actualizado a ${estado}`, reporte });
    } catch (error) {
        console.error("Error al actualizar el reporte:", error);
        res.status(500).json({ msg: "Error al actualizar el reporte." });
    }
});
 
// Ruta de prueba
router.get("/test", (req, res) => {
    res.send("Ruta test de reportes funcionando");
});
 
module.exports = router;
 
 