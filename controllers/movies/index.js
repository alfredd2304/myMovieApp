const express = require("express");
const authGuard = require("../../middlewares/authorization");
const  Movie  = require("../../models/myMovieList");
const router = express.Router();
const User = require("../../models/users");
const jwt = require("jsonwebtoken");

// endpoint para ver lista de usuario especifico
router.get('/lists/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // extrae encabezado cookie
      const tokenFromCookie = req.headers.cookie;
      
      const user = await User.findById(userId).populate('movies');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      const formattedMovies = user.movies.map(movie => {
        const formattedMovie = {
          title: movie.title,
          date: new Date(movie.date).getFullYear(),
        };
        // si encuentra cookie lee el token para verificar ID
        if (tokenFromCookie) {
          try {
            const token = tokenFromCookie.replace('Authorization=Bearer%20', '');
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
            if (decodedToken._id === userId) {
              // Si es el mismo ID de usuario, añadimos la propiedad deleteMovie
              formattedMovie.deleteMovie = `/movies/list/deleteMovie/${movie._id}`;
            }
          } catch (error) {
            console.error('Error al verificar el token:', error);
          }
        }
        return formattedMovie;
      });
  
      res.status(200).json({ movies: formattedMovies });
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
  
      res.status(200).json({lists, message: "PARA CALIFICAR LISTAS /movies/lists/rate/(:id_lista)"});
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
      // Encuentra al usuario por su ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      //Añade la referencia al ID de la nueva película al array 'movies' del usuario
      user.movies.push(newMovie._id);

      //Guarda los cambios en el usuario
      await user.save();
  
      res.status(201).json({ message: `${newMovie.title} agregada correctamente.`,
                            myLIST: `/movies/lists/${userId}`});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  
router.post('/lists/rate/:userId', authGuard, async (req, res) => {
    try {
      const userId = req.params.userId;
      const { rating } = req.body;
      const currentUserID = req.user._id;
      if (userId === currentUserID) {
        return res.status(400).json({ message: 'No puedes calificar tu propia lista.' });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5.' });
      }
  
      // Encuentra al usuario por su ID
      const userToRate = await User.findById(userId);
      if (!userToRate) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      // Verificamos si el usuario ya ha calificado la lista
      const hasRated = userToRate.ratings.some(r => r.userId.equals(req.user._id));
      if (hasRated) {
      return res.status(400).json({ message: 'Ya ha calificado la lista de este usuario.' });
        }
  
      // Añade la calificación a la lista de calificaciones del usuario
      userToRate.ratings.push({
        userId: req.user._id,
        rating,
      });
      // Calcula la nueva calificación promedio del usuario
      const totalRatings = userToRate.ratings.length;
      const totalRatingSum = userToRate.ratings.reduce((sum, r) => sum + r.rating, 0);
      userToRate.rating = totalRatingSum / totalRatings;
      
      await userToRate.save();
  
      res.status(200).json({ message: 'Calificación agregada correctamente.' });
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