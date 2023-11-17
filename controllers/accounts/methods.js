const jwt = require("jsonwebtoken");
const User = require("../../models/users");

const createToken = async (user, role, userId) => {
    const tokenPayLoad = {
        "username": user,
        "role": role,
        "_id": userId
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

    return await createToken(username, "normal", user._id)
};

module.exports = {createToken, registerUser, loginUser};