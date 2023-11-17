require("dotenv").config();

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

    app.listen(port, () => {
        console.log("Server funcionando en el puerto: ", port);
    });
};

main();