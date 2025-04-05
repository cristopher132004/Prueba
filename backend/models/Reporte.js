const mongoose = require("mongoose");

const ReporteSchema = new mongoose.Schema({
    ID_Reporte: { type: Number, required: true, unique: true },
    ID_Usuario: { type: String, required: true },
    Fecha_Creacion: { type: Date, default: Date.now },
    Descripcion: { type: String, required: true },
    Estatus: { type: String, default: "Pendiente" },
    Evidencia_Imagen: { type: String },
    Ubicacion: { type: String, required: true },
    Comentarios_Testigos: { type: String }
});

module.exports = mongoose.model("Reporte", ReporteSchema);
