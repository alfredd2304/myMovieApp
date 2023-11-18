require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3003;

const main = async () => {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    const accountsController = require("./controllers/accounts");
    const moviesController = require("./controllers/movies");
    const db = require("./db/client");

    await db.connectToMongoDB();

    app.use("/accounts", accountsController);
    app.use("/movies", moviesController);
    app.use(cookieParser());
    app.get("/home", (req,res) =>{
        res.json({
                  message:"BIENVENIDO A LA RED SOCIAL PARA CINEFILOS",
                  REGISTRARSE: "metodo POST /accounts/register",
                  LOGIN:"metodo POST /accounts/login",
                  LISTAS: "/movies/lists"})
    })

    app.listen(port, () => {
        console.log("Server funcionando en el puerto: ", port);
    });
};

main();