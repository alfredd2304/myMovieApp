const express = require("express");
const router = express.Router();
const accountsMethods = require("./methods");

router.post("/register", (req, res) => {
    res.json({res:"endpoint de registro de usuario"});
});

router.post("/login", (req, res) => {
    res.json({res:"endpoint de logeo de usuario"});
});

module.exports = router;



