import { PrismaClient } from '@/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import { autoUpdateTimestamp } from './prisma/extensions/autoUpdateTimestamp';

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<PrismaClient["$extends"]> | undefined
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] })
    .$extends(withAccelerate())
    .$extends(autoUpdateTimestamp);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma as unknown as PrismaClient;
