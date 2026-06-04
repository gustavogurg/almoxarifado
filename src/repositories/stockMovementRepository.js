import prisma from "../lib/prisma.js";

async function findAll() {
  return prisma.stockMovement.findMany({
    include: { product: true }
  });
}

async function findById(id) {
  return prisma.stockMovement.findUnique({
    where: { id },
    include: { product: true }
  });
}

// async function create(data) {
//   return prisma.stockMovement.create({ data });
// }

async function create(data) {
  // O prisma.$transaction permite realizar as operações em bloco com segurança.
  return prisma.$transaction(async (tx) => {
    
    // 1. Se for uma saída (OUT), verifica se há estoque suficiente
    if (data.type === "OUT") {
      const product = await tx.product.findUnique({
        where: { id: data.productId }
      });
      
      // Se não achar o produto, cancela a transação
      if (!product) throw new Error("Product_Not_Found");

      // Se tentar tirar mais do que o estoque atual tem, cancela a transação
      if (product.currentStock < data.quantity) {
        throw new Error("Insufficient_Stock");
      }
    }

    // 2. Cria a movimentação de estoque
    const movement = await tx.stockMovement.create({ data });

    // 3. Define a operação (Aumentar ou Diminuir o estoque)
    const updateOperation = data.type === "IN" 
      ? { increment: data.quantity } 
      : { decrement: data.quantity };

    // 4. Efetiva a atualização de quantidade no produto referenciado
    await tx.product.update({
      where: { id: data.productId },
      data: {
        currentStock: updateOperation
      }
    });

    return movement;
  });
}

async function findByProductId(productId) {
  return prisma.stockMovement.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' }, // Ordenacao
  });
}

export default { findAll, findById, create, findByProductId };
