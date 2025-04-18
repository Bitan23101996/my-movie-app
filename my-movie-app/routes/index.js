const express = require('express');
const router = express.Router();
const axios = require('axios');

// =====================API Releated=====================
const API_KEY = '1fb720b97cc13e580c2c35e1138f90f8';
const API_BASE_URL = 'http://api.themoviedb.org/3';
const NOW_PLAYING_URL = `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
const IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/w300';

router.use('/', (req, res, next) => {
  res.locals.imageBaseUrl = IMAGE_BASE_URL
  next();
})

/* GET home page. */
router.get('/', function (req, res, next) {
  axios.get(NOW_PLAYING_URL)
    .then(response => {
      res.render('index', { movieList: response.data.results });
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// GET single movie details
router.get('/movie/:id', (req, res) => {
  const movieId = req.params.id;
  const movieBaseURL = `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  axios.get(movieBaseURL).then(response => {
    res.render('single-movie', {
      movieDetails: response.data
    })
  }).catch(error => {
    console.error('Error:', error);
  });
});

//POST search moview by title & actor
router.post('/search', (req, res) => {
  const { searchedItem, cat } = req.body;
  const encodedSearchedItem = encodeURI(searchedItem);
  const movieUrl = `${API_BASE_URL}/search/${cat}?query=${encodedSearchedItem}&api_key=${API_KEY}`;
  axios.get(movieUrl)
    .then((response) => {
      let searchedMovieList = response.data.results;
      if(cat === 'person'){ searchedMovieList = response.data.results[0].known_for }
      res.render('index', {
        movieList: searchedMovieList
      })
      // console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
