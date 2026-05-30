import prisma from "../lib/prisma.js";

async function findAll() {
  return prisma.category.findMany();
}

async function findById(id) {
  return prisma.category.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.category.create({ data });
}

async function update(id, data) {
  try {
    return await prisma.category.update({ where: { id }, data });
  } catch {
    return null;
  }
}

async function remove(id) {
  try {
    await prisma.category.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export default { findAll, findById, create, update, remove };