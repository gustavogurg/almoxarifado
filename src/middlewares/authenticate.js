import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  // "Bearer eydhlk343kmsbndbfk..." -> ["Bearer", "eydhlk343kmsbndbfk..."]
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token mal formado." });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

export default authenticate;
