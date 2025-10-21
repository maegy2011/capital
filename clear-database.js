const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')

  // Delete all records in correct order to handle foreign key constraints
  await prisma.booking.deleteMany({})
  await prisma.tripStation.deleteMany({})
  await prisma.trip.deleteMany({})
  await prisma.wallet.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.bus.deleteMany({})
  await prisma.station.deleteMany({})

  console.log('Database cleared successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })