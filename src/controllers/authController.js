import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepo from "../repositories/userRepository.js";

// POST /auth/register
async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ error: 'O campo "email" é obrigatório.' });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      error:
        'O campo "password" é obrigatório e deve ter ao menos 6 caracteres.',
    });
  }

  const existing = await userRepo.findByEmail(email.trim());
  if (existing) {
    return res
      .status(409)
      .json({ error: "Já existe um usuário com esse e-mail." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.create({
    name: name.trim(),
    email: email.trim(),
    password: hashedPassword,
  });

  // Nunca retornar o password na resposta
  const { password: _, ...userWithoutPassword } = user;
  return res.status(201).json(userWithoutPassword);
}

// POST /auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  const user = await userRepo.findByEmail(email.trim());

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30000" },
  );

  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json({
    user: userWithoutPassword,
    token,
  });
}

export default { register, login };
