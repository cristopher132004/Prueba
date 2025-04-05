const express = require("express");
const router = express.Router();
const Sancion = require("../models/Sancion");
const Reporte = require("../models/Reporte"); // Necesitamos el modelo de Reporte para obtener el ID del usuario
const { auth, verificarModerador } = require("../middleware/auth");


// Ruta para crear una nueva sanción (solo para moderadores)
router.post("/", auth, verificarModerador, async (req, res) => {
    try {
        const { idReporte, tipoSancion, observaciones } = req.body;

        // Buscar el reporte para obtener el ID del usuario
        const reporte = await Reporte.findOne({ ID_Reporte: idReporte }); // Ajusta la búsqueda según tu modelo
        if (!reporte) {
            return res.status(404).json({ msg: "Reporte no encontrado." });
        }
        const idUsuario = reporte.ID_Usuario;

        // Crear un nuevo ID de sanción (puedes implementar una lógica más robusta)
        const totalSanciones = await Sancion.countDocuments();
        const idSancion = `SAN${String(totalSanciones + 1).padStart(3, '0')}`;

        const nuevaSancion = new Sancion({
            ID_Sancion: idSancion,
            ID_Reporte: idReporte,
            ID_Usuario: idUsuario,
            Tipo_Sancion: tipoSancion,
            Observaciones: observaciones
        });

        await nuevaSancion.save();
        res.status(201).json({ msg: "Sanción aplicada con éxito.", sancion: nuevaSancion });

    } catch (error) {
        console.error("Error al aplicar la sanción:", error);
        res.status(500).json({ msg: "Error del servidor al aplicar la sanción." });
    }
});

module.exports = router;