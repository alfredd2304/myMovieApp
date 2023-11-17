// middleware/authGuard.js
const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).send("No tiene permisos para acceder a este recurso");
  }

  try {
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log('Decoded Token:', decodedToken);

    // Asegúrate de que el payload incluya el ID del usuario
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("No tiene permisos para usar este recurso");
  }
};

module.exports = authGuard;