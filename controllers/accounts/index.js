const express = require("express");
const router = express.Router();
const accountsMethods = require("./methods");

router.post("/register", async (req, res) => {
    try{
        const user = await accountsMethods.registerUser(req.body);
        res.status(200).json({
            message: "Usuario registrado exitosamente",
            data: user
        });
    }catch(error){
        res.status(400).json(error);
    }
});

router.post("/login", async (req, res) => {
    const {user, password} = req.body;

    try{
        const accessToken = await accountsMethods.loginUser(user, password);
        if(!accessToken) throw new Error("Token invalido");
        res.status(200).json({message: "Te has logeado exitosamente... por favor copia y pega el siguiente token en el apartado TOKEN, dentro del encabezado Authorization", 
                            token:accessToken,
                            remember:"Recuerda que debes seleccionar el tipo de autorizacion BEARER TOKEN"});
    } catch(error){
        res.status(404).send("Nombre de usuario o contraseña incorrectas");
    }

});

module.exports = router;



