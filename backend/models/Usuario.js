const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
    ID_Usuario: { type: String, required: false, unique: true }, // No es obligatorio, puedes dejar que Mongo maneje el _id
    Nombre_Usuario: { type: String, required: true },
    Apellido_Usuario: { type: String, required: true },
    Tipo_Usuario: { type: String, enum: ["Usuario", "Moderador"], required: true },
    Email: { type: String, required: true, unique: true },
    Contraseña: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", UsuarioSchema);
