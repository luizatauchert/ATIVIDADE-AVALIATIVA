import express, { Request, Response } from 'express';
import sql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config: sql.config = {
  user: 'root',
  password: 'root',
  server: 'localhost',
  database: 'bookshop',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

interface CadastroRequestBody {
  name: string;
  email: string;
  password: string;
  confirmar: string;
}

app.post('/api/cadastro', async (req: Request<{}, {}, CadastroRequestBody>, res: Response) => {
  const { name, email, password, confirmar } = req.body;

  if (password !== confirmar) {
    return res.status(400).json({ msg: 'As senhas não conferem' });
  }

  try {
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Usuarios WHERE Email = @email');

    if (result.recordset.length > 0) {
      return res.status(400).json({ msg: 'Email já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(password, salt);

    await pool
      .request()
      .input('nome', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('senha', sql.NVarChar, senhaHash)
      .query(
        'INSERT INTO Usuarios (Nome, Email, Senha) VALUES (@nome, @email, @senha)'
      );

    return res.status(201).json({ msg: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Erro no servidor' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});