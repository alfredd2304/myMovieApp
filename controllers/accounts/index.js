const express = require("express");
const router = express.Router();
const accountsMethods = require("./methods");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try{
        // guarda la solicitud del body y registra usuario
        const user = await accountsMethods.registerUser(req.body);
        res.status(200).json({
            message: "Usuario registrado exitosamente",
            LOGIN: "metodo POST /accounts/login",
            LISTAS: "/movies/lists/"
        });
    }catch(error){
        res.status(400).json(error);
    }
});

router.post("/login", async (req, res) => {
    // lee solicitud del body
    const {user, password} = req.body;

    try {
        //Crea el token 
        const accessToken = await accountsMethods.loginUser(user, password);
        if (!accessToken) throw new Error("Token inválido");
        
        // Establece encabezado cookie con el token
        res.cookie('Authorization', `Bearer ${accessToken}`, { httpOnly: true });
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
        const userId = decodedToken._id
        res.status(200).json({
            message: "Te has logeado exitosamente...",
            myLIST: `/movies/lists/${userId}`,
            addMovies: "metodo POST /movies/list/addMovie",
            LISTAS: "/movies/lists",
        });
    } catch (error) {
        res.status(404).send("Nombre de usuario o contraseña incorrectas");
    }
});


module.exports = router;



