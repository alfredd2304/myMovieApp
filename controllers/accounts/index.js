const express = require("express");
const router = express.Router();
const accountsMethods = require("./methods");

router.post("/register", (req, res) => {
    res.json({res:"endpoint de registro de usuario"});
});

router.post("/login", async (req, res) => {
    const {user, password} = req.body;
    if (user==="admin" && password==="123456") {
        //generamos token
        const accessToken = await accountsMethods.createToken(user, "admin");
        res.status(200).json(accessToken);
        return;
    }
    res.status(404).json({error: "Datos de ingreso incorrectos"})
});

module.exports = router;



