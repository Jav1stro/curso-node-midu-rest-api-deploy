import { randomUUID } from "node:crypto";
// import { readJSON } from "../../utils";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("../../data/movies.json");

// const movies = [
//   {
//     id: "dcdd0fad-a94c-4810-8acc-5f108d3b18c3",
//     title: "The Shawshank Redemption",
//     year: 1994,
//     director: "Frank Darabont",
//     duration: 142,
//     poster: "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
//     genre: ["Drama"],
//     rate: 9.3,
//   },
//   {
//     id: "c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf",
//     title: "The Dark Knight",
//     year: 2008,
//     director: "Christopher Nolan",
//     duration: 152,
//     poster: "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg",
//     genre: ["Action", "Crime", "Drama"],
//     rate: 9.0,
//   },
// ];

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    return movies;
  }

  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id === id);
    return movie;
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    };

    movies.push(newMovie);

    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };

    return movies[movieIndex];
  }
}
