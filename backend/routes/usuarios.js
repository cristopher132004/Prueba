const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        console.log(req.body);  // Verifica los datos que llegan al backend
        
        const { Nombre_Usuario, Apellido_Usuario, Tipo_Usuario, Email, Contraseña } = req.body;

        let usuario = await Usuario.findOne({ Email });
        if (usuario) return res.status(400).json({ msg: "El correo ya está registrado." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Contraseña, salt);

        usuario = new Usuario({
            ID_Usuario: new mongoose.Types.ObjectId().toString(), // Genera un ID único si decides usarlo
            Nombre_Usuario,
            Apellido_Usuario,
            Tipo_Usuario,
            Email,
            Contraseña: hashedPassword
        });

        await usuario.save();  // Guardamos el usuario en la base de datos
        res.status(201).json({ msg: "Usuario registrado exitosamente." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("📨 Datos recibidos:", req.body);
        const { email, contraseña } = req.body;

        const usuario = await Usuario.findOne({ Email: email });
        if (!usuario) {
            console.log("❌ Usuario no encontrado en la base de datos");
            return res.status(400).json({ msg: "Credenciales inválidas." });
        }

        console.log("✅ Usuario encontrado:", usuario);

        const isMatch = await bcrypt.compare(contraseña, usuario.Contraseña);
        if (!isMatch) {
            console.log("❌ Contraseña incorrecta");
            return res.status(400).json({ msg: "Credenciales inválidas." });
        }

        const token = jwt.sign(
            { ID_Usuario: usuario.ID_Usuario, Tipo_Usuario: usuario.Tipo_Usuario },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("🔑 Token generado:", token);
        
        // 🔹 Enviar también el Tipo_Usuario en la respuesta
        res.json({ token, Tipo_Usuario: usuario.Tipo_Usuario });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
});

module.exports = router;