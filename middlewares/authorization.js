const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  const tokenFromCookie = req.headers.cookie
  if (!tokenFromCookie) {
    return res.status(401).json({ message: 'No tiene permisos para usar este recurso.' });
  }
  // Extraer solo el token real eliminando "Bearer%20"
  const token = tokenFromCookie.replace('Authorization=Bearer%20', '');
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'No tiene permisos para usar este recurso.' });
  }
};


module.exports = authGuard;