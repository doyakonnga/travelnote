import { prisma } from "./src/prisma-client"


async function main() {
  try {
    // await prisma.expense.deleteMany()

    const consumption = await prisma.consumption.create( { data: {
      isForeign: true,
      payingUserId: "bfe12b8a-f9a5-4e12-8c84-8485044bfc57",
      journeyId: "381064a3-190b-4ec3-a8b7-94c919d0ee27",
      expenses: {
        createMany: {
          data: [
            {
              userId: "bfe12b8a-f9a5-4e12-8c84-8485044bfc58",
              amount: 1100,
              isPaid: false,
            }
          ]
        }
      }
    }})

    // const users = await prisma.user.findMany({})
    // console.log(users)
  } catch (e) {
    console.log(e)
  }
}

main()