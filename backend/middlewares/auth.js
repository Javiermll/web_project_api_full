const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const tokenHeader = req.headers.authorization || req.headers.Authorization;
  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No autorizado: token faltante" }); // Cambia a 403
  }
  const token = tokenHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "No autorizado: token inválido" }); // Cambia a 403
  }
};
