import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Livro } from "../models/livro";

const livroRepository = AppDataSource.getRepository(Livro);

export class LivroController {
  // Listar todos os livros
  async list(req: Request, res: Response) {
    const Livro = await livroRepository.find();
    res.json(Livro);
    return;
  }

  // Criar novo livros
  async create(req: Request, res: Response) {
    const { name, tipo, ano } = req.body;

    if (!name || !tipo || !ano) {
      res.status(400).json({ message: "Todos os campos são necessários!" });
      return;
    }

    const Livros = new Livro(name, tipo, ano);
    const newlivro = await livroRepository.create(Livros);
    await livroRepository.save(newlivro);

    res
      .status(201)
      .json({ message: "livro criado com sucesso", livro: newlivro });
    return;
  }

  // Buscar livros por ID
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const livro = await livroRepository.findOneBy({ id: Number(id) });

    if (!livro) {
      res.status(404).json({ message: "livro não encontrado" });
      return;
    }

    res.json(livro);
    return;
  }

  // Atualizar livros
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, tipo, ano } = req.body;

    const livro = await livroRepository.findOneBy({ id: Number(id) });

    if (!livro) {
      res.status(404).json({ message: "livro não encontrado" });
      return;
    }

    livro.name = name;
    livro.tipo = tipo;
    livro.ano = ano;

    await livroRepository.save(livro);

    res.json(livro);
    return;
  }

  // Deletar livros
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const livro = await livroRepository.findOneBy({ id: Number(id) });

    if (!livro) {
      res.status(404).json({ message: "livro não encontrado" });
      return;
    }

    await livroRepository.remove(livro);

    res.status(204).send();
    return;
  }
}