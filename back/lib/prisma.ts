import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

prisma
    .$connect()
    .then(() => console.log('Prisma connected!'))
    .catch((e: Error) => console.error('Prisma error:', e));
export default prisma;
