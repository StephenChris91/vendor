import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }

// declare global {
//   var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
// }

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma


if (process.env.NODE_ENV !== 'production') globalThis.prisma = db