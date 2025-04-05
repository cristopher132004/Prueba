const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads")); // Servir archivos subidos

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(err => console.error("❌ Error al conectar a MongoDB Atlas", err));

// Rutas del Backend
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/reportes", require("./routes/reportes"));
app.use("/api/sanciones", require("./routes/sanciones")); // Mueve esta línea aquí

// Iniciar Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));