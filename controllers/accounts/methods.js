const jwt = require("jsonwebtoken");
const User = require("../../models/users");

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

const registerUser = async (payload) => {
    try{
        const newUser = new User(payload);
        await newUser.save();
        return newUser;
    }catch(error){
        console.log(error);
        if (error.code === 11000) throw new Error("Usuario no disponible");
        else throw error;
    }
};

const loginUser = async (username, password) => {
    const user = await User.findOne({nickname: username});
    if (!user) throw new Error("usuario no encontrado");

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) throw new Error("contraseña invalida");

    return await createToken(username, "normal")
};

module.exports = {createToken, registerUser, loginUser};