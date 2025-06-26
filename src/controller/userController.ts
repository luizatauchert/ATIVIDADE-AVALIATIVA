import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../models/user";
import bcryptjs from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  // Listar todos os usuários
  async list(req: Request, res: Response) {
    const users = await userRepository.find();
    res.json(users);
    return;
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      res.status(404).json({ message: "Usuario não encontrado" });
      return;
    }

    const isValid = await bcryptjs.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ message: "senha invalida" });
      return;
    } else {
      res.status(200).json({ message: "login bem sucedido" });
      return;
    }
  }

  // Criar novo usuário
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Todos os campos são necessários!" });
      return;
    }

    const user = new User(name, email, password);
    const newUser = await userRepository.create(user);
    await userRepository.save(newUser);

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user: newUser });
    return;
  }

  // Buscar usuário por ID
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.json(user);
    return;
  }

  // Atualizar usuário
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    user.name = name;
    user.email = email;
    user.password = password;

    await userRepository.save(user);

    res.json(user);
    return;
  }

  // Deletar usuário
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    await userRepository.remove(user);

    res.status(204).send();
    return;
  }
}