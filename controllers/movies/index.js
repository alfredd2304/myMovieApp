const express = require("express");
const authGuard = require("../../middlewares/authorization");
const  Movie  = require("../../models/myMovieList");
const router = express.Router();
const User = require("../../models/users");


router.post("/list/all", (req, res) => {
    res.send("endpoint para ver todas las listas de peliculas")
})

router.post('/list/addMovie', authGuard, async (req, res) => {
    try {
      const { title, date } = req.body;
  
      if (!title || !date) {
        return res.status(400).json({ message: 'Se requieren título y fecha para agregar la película.' });
      }
  
      // Crea una nueva película
      const newMovie = new Movie({
        title,
        date: new Date(date),
      });
  
      // Guarda la película en la base de datos
      await newMovie.save();
  
      // Obtiene el ID del usuario directamente desde req.user._id
      const userId = req.user._id;
      console.log(userId);
      // Encuentra al usuario por su ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      // Añade la referencia al ID de la nueva película al array 'movies' del usuario
      user.movies.push(newMovie._id);
  
      // Guarda los cambios en el usuario
      await user.save();
  
      res.status(201).json({ message: 'Película agregada correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  
  module.exports = router;