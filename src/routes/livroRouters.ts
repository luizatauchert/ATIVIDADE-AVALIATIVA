import { Router } from "express";
import { LivroController } from "../controller/livroController";

const routes = Router();
const livroController = new LivroController();

routes.get("/livro", livroController.list);
routes.post("/livro", livroController.create);
routes.get("/livro/:id", livroController.show);
routes.put("/livro/:id", livroController.update);
routes.delete("/livro/:id", livroController.delete);

export default routes;