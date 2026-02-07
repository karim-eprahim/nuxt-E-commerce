// server/utils/prisma.ts
// import { PrismaClient } from '@/generated/prisma/client'

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// export const prisma = globalForPrisma.prisma

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// استيراد من المكان اللي Prisma ولدت فيه الـ Client
import { PrismaClient } from '../../app/generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db