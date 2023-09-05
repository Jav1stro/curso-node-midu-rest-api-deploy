import pc from "picocolors";
import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { moviesRouter } from "./routes/movies";

const app = express();
app.use(json());
app.disabled("x-powered-by");
// cors
app.use(corsMiddleware());

// routes
app.use("/movies", moviesRouter);
 
const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(
    pc.blue(`Server listening on port ${pc.yellow(`http://localhost:${PORT}`)}`)
  );
});
