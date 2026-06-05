import prisma from "../lib/prisma.js";

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function create(data) {
  return prisma.user.create({ data });
}

export default { findByEmail, create };