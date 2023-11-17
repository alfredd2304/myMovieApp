const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Token no proporcionado. Acceso no autorizado.' });
    }

    try {
        const token = authorization.split(" ")[1];
        req.jwt_payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next(); 
    } catch (err) {
        console.error(err);

        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token inválido. Acceso no autorizado.' });
        }

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expirado. Acceso no autorizado.' });
        }

        res.status(401).json({ message: 'Error de autenticación. Acceso no autorizado.' });
    }
}

module.exports = authGuard;
