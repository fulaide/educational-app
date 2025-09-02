// Import and re-export Prisma client and types
import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
export { PrismaClient };

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export database utilities
export * from './db-utils.js';
export * from './migration-utils.js';
export * from './seed-config.js';