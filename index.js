const express = require("express");
const app = express();
const port = 3003;

const accountsController = require("./controllers/accounts");
//const moviesController = require("./controllers/movies");

app.use("/accounts", accountsController);
//app.use("/movies", moviesController)

app.listen(port, () => {
    console.log("Server funcionando en el puerto: ", port);
})