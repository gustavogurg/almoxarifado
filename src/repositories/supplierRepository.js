import prisma from "../lib/prisma.js";

async function findAll() {
  return prisma.supplier.findMany();
}

async function findById(id) {
  return prisma.supplier.findUnique({
    where: { id }
  });
}

async function create(data) {
  return prisma.supplier.create({ data });
}

async function update(id, data) {
  try {
    return await prisma.supplier.update({ where: { id }, data });
  } catch {
    return null;
  }
}

async function remove(id) {
  try {
    return await prisma.supplier.delete({ where: { id } });
  } catch {
    return null;
  }
}

export default { findAll, findById, create, update, remove };
