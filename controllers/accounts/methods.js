const jwt = require("jsonwebtoken");

const createToken = async (user, role) => {
    const tokenPayLoad = {
        "username": user,
        "role": role
    }
    const token = await jwt.sign(
        tokenPayLoad,
        process.env.JWT_SECRET_KEY,
        {expiresIn: process.env.JWT_TTL}
    );
    return token;
};

module.exports = {createToken};