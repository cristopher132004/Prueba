const mongoose = require("mongoose");

const SancionSchema = new mongoose.Schema({
    ID_Sancion: {
        type: String,
        required: true,
        unique: true
    },
    ID_Reporte: {
        type: mongoose.Schema.Types.Number, // Ajusta el tipo si es diferente
        required: true
    },
    ID_Usuario: {
        type: String,
        required: true
    },
    Tipo_Sancion: {
        type: String,
        required: true
    },
    Fecha_Sancion: {
        type: Date,
        default: Date.now
    },
    Estado_Sancion: {
        type: String,
        default: "Activa"
    },
    Observaciones: {
        type: String
    }
});

module.exports = mongoose.model("Sancion", SancionSchema);