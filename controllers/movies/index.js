const express = require("express");
const authGuard = require("../../middlewares/authorization");
const  Movie  = require("../../models/myMovieList");
const router = express.Router();
const User = require("../../models/users");

router.get('/lists/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Encuentra al usuario por su ID
      const user = await User.findById(userId).populate('movies');
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      
      res.status(200).json({
        movies: user.movies.map(movie => ({
          title: movie.title,
          date: new Date(movie.date).getFullYear(),
          deleteMovie: `/movies/list/deleteMovie/${movie._id}`
        })),message: "metodo DELETE para eliminar peliculas"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

  router.get('/lists', async (req, res) => {
    try {
      // Encuentra todos los usuarios
      const users = await User.find().select('nickname rating list _id');
  
      const lists = users.map(user => ({
        list: user.list,
        nickname: user.nickname,
        rating: user.rating,
        IR:`/movies/lists/${user._id}`
      }));
  
      res.status(200).json({lists});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

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
  
      res.status(201).json({ message: `${newMovie.title} agregada correctamente.`,
                            myLIST: `/movies/lists/${userId}`});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  
  router.delete('/list/deleteMovie/:movieId', authGuard, async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      const movieId = req.params.movieId;
      // Verifica si la película está en la lista del usuario
      const movieIndex = user.movies.indexOf(movieId);
      if (movieIndex === -1) {
        return res.status(404).json({ message: 'Película no encontrada en la lista del usuario.' });
      }
      // Elimina la película del array 'movies' del usuario
      user.movies.splice(movieIndex, 1);
      await user.save();
      // Elimina la pelicula de la base de datos
      await Movie.findByIdAndDelete(movieId);
      res.status(200).json({ message: 'Película eliminada correctamente.' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

  module.exports = router;