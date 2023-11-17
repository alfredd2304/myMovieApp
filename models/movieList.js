const {Schema, model} = require("mongoose");

const movieListSchema = new Schema ({
    name: {
        type: String,
        required: [true, "Debe ingresar el nombre de la lista de peliculas"]
    },
    owner: {
        type: String,
        require: [true, "El nickname del usuario es obligatorio"]
    },
    rating: {
        type: Number,
        default: 5,
        require: [true, "Debe ingresar la calificacion de la lista"]
    },
    movies: [{name: String, year: Number, image: String}]
}, {
    timestamps: {createdAt: "createAt", updatedAt: "updateAt"}
});

const movieList = model("MovieList", movieListSchema);
module.exports = movieList;
