import prisma from "../lib/prisma.js";

async function findAll() {
  return prisma.product.findMany();
}

async function findById(id) {
  return prisma.product.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.product.create({ data });
}

async function update(id, data) {
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch {
    return null;
  }
}

async function remove(id) {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export default { findAll, findById, create, update, remove };