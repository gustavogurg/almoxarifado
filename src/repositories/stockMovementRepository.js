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

async function create(data) {
  return prisma.stockMovement.create({ data });
}

async function update(id, data) {
  try {
    return await prisma.stockMovement.update({ where: { id }, data });
  } catch {
    return null;
  }
}

async function remove(id) {
  try {
    return await prisma.stockMovement.delete({ where: { id } });
  } catch {
    return null;
  }
}

export default { findAll, findById, create, update, remove };
