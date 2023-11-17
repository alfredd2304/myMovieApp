const {connection} = require("mongoose");

const gracefulShutdown = async () => {
    console.log("Cerrando conexion a MongoDB...");
    await connection.close();
    console.log("Conexion a MongoDB cerrada.")
};

const setUpMongoDBProcessWatchers = () => {
    //cerrar conexion en process.exit()
    process.on("exit", gracefulShutdown);

    //cerrar conexion en comandos del CLI
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGKILL", gracefulShutdown);
    //cerrar conexion en excepciones no controladas
    process.on("uncaughtException", gracefulShutdown);
};

module.exports = {gracefulShutdown, setUpMongoDBProcessWatchers};
