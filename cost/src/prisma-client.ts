import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export async function createJourney(journey: {
  id: string; members: { id: string }[]
}) {
  return await prisma.journey.create({
    data: {
      id: journey.id,
      memberIds: journey.members.map((m) => m.id)
    }
  })
}

export async function modifyJourney(journey: {
  id: string; members: { id: string }[]
}) {
  return await prisma.journey.update({
    where: { id: journey.id },
    data: {
      memberIds: journey.members.map((m) => m.id)
    }
  })
}

export async function areUsersInJourney(userIds: string[], journeyId: string) {
  const journey = await prisma.journey.findUnique({ where: { id: journeyId } })
  if (!journey) throw '404'
  const usersNotIn = userIds.filter((id) => !journey.memberIds.includes(id))
  return !usersNotIn.length
}

export async function journeyConsumptions(id: string) {
  return await prisma.consumption.findMany({
    where: { journeyId: id },
    include: { expenses: { orderBy: { userId: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  })
}

export async function userExpenses(userId: string, journeyId: string) {
  return await prisma.expense.findMany({
    where: {
      userId,
      consumption: { journeyId }
    },
    include: { consumption: true },
    orderBy: { consumption: { createdAt: 'desc' } }
  })
}

export async function unpaidExpenses(journeyId: string) {
  return await prisma.expense.findMany({
    where: {
      consumption: { journeyId },
      isPaid: false
    },
    include: {
      consumption: {
        select: {
          payingUserId: true,
          isForeign: true
        }
      }
    }
  })
}

interface ExpenAttr {
  userId: string
  amount: number
}
interface ConsAttr {
  journeyId: string
  name: string
  isForeign: boolean
  rate: number | undefined
  payingUserId: string
  expenses: ExpenAttr[]
}
export async function createConsumption(attrs: ConsAttr) {
  return await prisma.consumption.create({
    data: {
      journeyId: attrs.journeyId,
      name: attrs.name,
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

export async function updateConsumption(attrs: ConsAttr & { id: string }) {
  const { id, rate, expenses, ...data } = attrs
  return await prisma.consumption.update({
    where: { id },
    data: {
      ...data,
      rate: rate || null,
      expenses: {
        deleteMany: {},
        createMany: {
          data: expenses.map((expense) => {
            return {
              ...expense,
              isPaid: expense.userId === data.payingUserId
            }
          }).filter((expense) => expense.amount)
        }
      }
    },
    include: { expenses: true }
  })
}

export interface ExpenseQuery {
  id: string
  isPaid?: boolean
  description?: string
  amount?: number
}
export async function updateExpense(query: ExpenseQuery) {
  const { id, ...data } = query
  return await prisma.expense.update({
    where: { id },
    data
  })
}
