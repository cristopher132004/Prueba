const jwt = require("jsonwebtoken");
 
const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado. No hay token." });
    }
 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Asumimos que la información del usuario está dentro de 'decoded.user'
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
 
        // Verifica si el error es de expiración del token
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "El token ha expirado. Por favor, inicia sesión nuevamente." });
        }
 
        res.status(400).json({ msg: "Token no válido." });
    }
};
 
const verificarModerador = (req, res, next) => {
    if (!req.user || req.user.Tipo_Usuario !== "Moderador") {
        return res.status(403).json({ msg: "Acceso denegado. No eres moderador." });
    }
    next();
};
 
module.exports = { auth, verificarModerador };