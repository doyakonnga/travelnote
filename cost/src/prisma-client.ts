import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export async function areUsersInJourney(userIds: string[], journeyId: string) {
  const journey = await prisma.journey.findUnique({ where: { id: journeyId } })
  if (!journey) throw '404'
  const usersNotIn = userIds.filter((id) => !journey.memberIds.includes(id))
  return !usersNotIn.length
}

export async function journeyConsumptions(id: string) {
  return await prisma.consumption.findMany({
    where: { journeyId: id },
    include: { expenses: true }
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

interface ExpenAttr {
  userId: string
  amount: number
}
interface ConsAttr {
  journeyId: string
  isForeign: boolean
  rate: number
  payingUserId: string
  expenses: ExpenAttr[]
}
export async function createConsumption(attrs: ConsAttr) {
  return await prisma.consumption.create({
    data: {
      journeyId: attrs.journeyId,
      isForeign: attrs.isForeign,
      rate: attrs.rate || null,
      payingUserId: attrs.payingUserId,
      expenses: {
        createMany: {
          data: attrs.expenses.map((expense) => {
            return {
              ...expense,
              isPaid: expense.userId === attrs.payingUserId
            }
          })
        }
      }
    },
    include: { expenses: true }
  })
}