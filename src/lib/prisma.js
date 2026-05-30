import { PrismaClient } from '@prisma/client';

//instancia global do prisma para interagir com o banco
const prisma = new PrismaClient();
export default prisma;