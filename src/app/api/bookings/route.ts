import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status.toUpperCase()

    const bookings = await db.booking.findMany({
      where,
      include: {
        user: true,
        trip: {
          include: {
            bus: true,
            supervisor: true,
            tripStations: {
              include: {
                station: true
              },
              orderBy: {
                stopOrder: 'asc'
              }
            }
          }
        },
        station: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, tripId, stationId, totalPrice, paymentMethod } = body

    // Generate QR code (simplified - in real app you'd use a proper QR library)
    const qrCode = `BOOKING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const booking = await db.booking.create({
      data: {
        userId,
        tripId,
        stationId,
        totalPrice,
        paymentMethod,
        qrCode,
        status: 'CONFIRMED'
      },
      include: {
        user: true,
        trip: {
          include: {
            bus: true,
            supervisor: true,
            tripStations: {
              include: {
                station: true
              },
              orderBy: {
                stopOrder: 'asc'
              }
            }
          }
        },
        station: true
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}