import "dotenv/config";
import express from "express";
//import { PrismaClient } from "@prisma/client";

import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import stockMovementRoutes from "./src/routes/stockMovementRoutes.js";
import supplierRoutes from "./src/routes/supplierRoutes.js";

// const prisma = new PrismaClient();
const app = express();
const port = 4000;

app.use(express.json());
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/stock-movements", stockMovementRoutes);
app.use("/suppliers", supplierRoutes);



// Criamos uma rota simples que retorna uma mensagem de boas-vindas
app.get("/", (_req, res) => {
  res.send("Serviço rodando!");
});

// Iniciamos o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});