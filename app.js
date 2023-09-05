const express = require("express");
const cors = require("cors");
const crypto = require("node:crypto");
const pc = require("picocolors");
const { validateMovie, validatePartialMovie } = require("./schemas/movies.js");

// JSON with movies
const movies = require("./movies.json");

const app = express();
app.use(express.json());
app.disabled("x-powered-by");
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:1234",
        "https://movies.com",
        "https://midu.dev",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

const ACCEPTED_ORIGINS = ["http://localhost:1234", "http://localhost:8080"];

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json({ message: "Pelicula encontrada!", movie: movie });

  res.status(404).json({ message: "Movie not found." });
});

// POST create MOVIE
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  console.log(`Post movie ${JSON.stringify(req.body)}`, result.success);

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

// PATCH edit movie
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1)
    return res.status(404).json({ message: "movie not found" });

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updatedMovie;

  return res.json(updatedMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1)
    return res.status(404).json({ message: "movie not found" });

  movies.splice(movieIndex, 1);

  return res.json({ message: "movie deleted" });
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(
    pc.blue(`Server listening on port ${pc.yellow(`http://localhost:${PORT}`)}`)
  );
});
