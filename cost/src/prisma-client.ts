import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

// export async function isUserInJourney(userId: string, journeyId: string) {
//   const journey = await prisma.journey.findUnique({ where: { id: journeyId }})
//   if (!journey) throw '404'
//   return journey.memberIds.includes(userId)
// }

export async function journeyConsumptions(id: string) {
  return await prisma.consumption.findMany({
    where: { journeyId: id }
  })
}

export async function userExpenses(userId: string, journeyId: string) {
  return await prisma.expense.findMany({
    where: {
      userId, 
      consumption: { journeyId }
    }
  })
}