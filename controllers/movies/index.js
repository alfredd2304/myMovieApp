const express = require("express");
const authGuard = require("../../middlewares/authorization");
const router = express.Router();


router.post("/list/all", (req, res) => {
    res.send("endpoint para ver todas las listas de peliculas")
})

router.post("/list/addMovie", authGuard, (req, res) => {
    const userId = req.jwt_payload.userId
    res.json({ userId, message: 'Obteniendo lista de películas del usuario.' });
})

module.exports = router;
