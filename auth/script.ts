import { prisma } from './src/prisma-client'

async function main() {
  try {
    const users = await prisma.user.deleteMany()
    console.log('deleted: ', users)

    // const user = await prisma.user.create({
    //   data: {
    //     name: 'mei',
    //     email: 'mei@gmail.com'
    //   }
    // })
    // console.log(user)

    // const users = await prisma.user.findMany({})
    // console.log(users)
  } catch (e) {
    console.log(e)
  }
}

main()
