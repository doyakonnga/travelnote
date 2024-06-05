import { prisma } from './src/prisma-client'

const script = async () => {
  try {
    const j = await prisma.journey.delete({
      where: { id: 'f5a4f75e-9bdf-4d05-a9c9-56cdafc876c7' }
    })
    console.log('deleted', j)
  } catch (e) {
    console.log(e)
  }
}

script()