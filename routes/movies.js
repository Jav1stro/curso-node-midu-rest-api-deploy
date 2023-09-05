import { Router } from "express";
import { MovieController } from "../controllers/movies";

export const moviesRouter = Router();

moviesRouter.get("/", MovieController.getAll);

moviesRouter.get("/:id", MovieController.getById);

moviesRouter.post("/", MovieController.create);

moviesRouter.patch("/:id", MovieController.update);

moviesRouter.delete("/movies/:id", MovieController.update);
