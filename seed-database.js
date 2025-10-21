const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample stations
  const stations = await Promise.all([
    prisma.station.create({
      data: {
        name: 'Tahrir Square Station',
        address: 'Tahrir Square, Cairo',
        latitude: 30.0444,
        longitude: 31.2357,
        description: 'Central Cairo hub'
      }
    }),
    prisma.station.create({
      data: {
        name: 'Nasr City Station',
        address: 'Nasr City, Cairo',
        latitude: 30.0605,
        longitude: 31.3314,
        description: 'Eastern Cairo location'
      }
    }),
    prisma.station.create({
      data: {
        name: 'Maadi Station',
        address: 'Maadi, Cairo',
        latitude: 29.9592,
        longitude: 31.2572,
        description: 'Southern Cairo station'
      }
    }),
    prisma.station.create({
      data: {
        name: 'Heliopolis Station',
        address: 'Heliopolis, Cairo',
        latitude: 30.0937,
        longitude: 31.3285,
        description: 'Northeastern Cairo hub'
      }
    })
  ])

  // Create sample buses
  const buses = await Promise.all([
    prisma.bus.create({
      data: {
        plateNumber: 'CA 1234',
        type: 'STANDARD',
        capacity: 30
      }
    }),
    prisma.bus.create({
      data: {
        plateNumber: 'CA 5678',
        type: 'DELUXE',
        capacity: 25
      }
    }),
    prisma.bus.create({
      data: {
        plateNumber: 'CA 9012',
        type: 'VIP',
        capacity: 20
      }
    })
  ])

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ahmed.h@example.com',
        name: 'Ahmed Hassan',
        phone: '+201234567890',
        role: 'PASSENGER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mohamed.a@example.com',
        name: 'Mohamed Ali',
        phone: '+201987654321',
        role: 'SUPERVISOR'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sara.m@example.com',
        name: 'Sara Mahmoud',
        phone: '+201555555555',
        role: 'ADMIN'
      }
    })
  ])

  // Create wallets for users
  await Promise.all(users.map(user => 
    prisma.wallet.create({
      data: {
        userId: user.id,
        balance: Math.floor(Math.random() * 1000) + 100
      }
    })
  ))

  // Create sample trips
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        busId: buses[0].id,
        departureTime: new Date('2024-01-15T08:00:00'),
        arrivalTime: new Date('2024-01-15T09:00:00'),
        price: 25.0,
        supervisorId: users[1].id
      }
    }),
    prisma.trip.create({
      data: {
        busId: buses[1].id,
        departureTime: new Date('2024-01-15T08:30:00'),
        arrivalTime: new Date('2024-01-15T09:30:00'),
        price: 35.0,
        supervisorId: users[1].id
      }
    }),
    prisma.trip.create({
      data: {
        busId: buses[2].id,
        departureTime: new Date('2024-01-15T09:00:00'),
        arrivalTime: new Date('2024-01-15T10:00:00'),
        price: 50.0,
        supervisorId: users[1].id
      }
    })
  ])

  // Create trip stations (route stops)
  await Promise.all([
    // Trip 1: Tahrir -> Nasr City
    prisma.tripStation.create({
      data: {
        tripId: trips[0].id,
        stationId: stations[0].id,
        stopOrder: 0,
        arrivalTime: new Date('2024-01-15T08:00:00'),
        departureTime: new Date('2024-01-15T08:05:00')
      }
    }),
    prisma.tripStation.create({
      data: {
        tripId: trips[0].id,
        stationId: stations[1].id,
        stopOrder: 1,
        arrivalTime: new Date('2024-01-15T08:55:00'),
        departureTime: new Date('2024-01-15T09:00:00')
      }
    }),
    // Trip 2: Nasr City -> Heliopolis
    prisma.tripStation.create({
      data: {
        tripId: trips[1].id,
        stationId: stations[1].id,
        stopOrder: 0,
        arrivalTime: new Date('2024-01-15T08:30:00'),
        departureTime: new Date('2024-01-15T08:35:00')
      }
    }),
    prisma.tripStation.create({
      data: {
        tripId: trips[1].id,
        stationId: stations[3].id,
        stopOrder: 1,
        arrivalTime: new Date('2024-01-15T09:25:00'),
        departureTime: new Date('2024-01-15T09:30:00')
      }
    })
  ])

  // Create sample bookings
  await Promise.all([
    prisma.booking.create({
      data: {
        userId: users[0].id,
        tripId: trips[0].id,
        stationId: stations[0].id,
        totalPrice: 25.0,
        paymentMethod: 'WALLET',
        qrCode: 'BOOKING-001',
        status: 'CONFIRMED'
      }
    }),
    prisma.booking.create({
      data: {
        userId: users[0].id,
        tripId: trips[1].id,
        stationId: stations[1].id,
        totalPrice: 35.0,
        paymentMethod: 'CREDIT_CARD',
        qrCode: 'BOOKING-002',
        status: 'CONFIRMED'
      }
    }),
    prisma.booking.create({
      data: {
        userId: users[0].id,
        tripId: trips[2].id,
        stationId: stations[2].id,
        totalPrice: 50.0,
        paymentMethod: 'WALLET',
        qrCode: 'BOOKING-003',
        status: 'PENDING'
      }
    })
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })