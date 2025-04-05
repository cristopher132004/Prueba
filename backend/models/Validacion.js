const mongoose = require("mongoose");

const ValidacionSchema = new mongoose.Schema({
    ID_Validacion: { type: Number, unique: true, required: true, default: 1 }, // Puedes ajustar la lógica del ID
    ID_Reporte: { type: mongoose.Schema.Types.ObjectId, ref: 'Reporte', required: true }, // Referencia al Reporte aprobado
    ID_Moderador: { type: String, required: true }, // ID del moderador que aprobó
    Fecha_Validacion: { type: Date, default: Date.now },
    Resultado: { type: String, enum: ["Aprobado", "Rechazado"], required: true },
    Motivo: { type: String }
}, { timestamps: true });

// Middleware para auto-incrementar ID_Validacion (opcional)
ValidacionSchema.pre('save', async function(next) {
    if (!this.isNew) {
        next();
        return;
    }
    try {
        const lastValidation = await mongoose.model('Validacion', ValidacionSchema).findOne({}, {}, { sort: { 'ID_Validacion' : -1 } });
        this.ID_Validacion = lastValidation ? lastValidation.ID_Validacion + 1 : 1;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Validacion", ValidacionSchema);