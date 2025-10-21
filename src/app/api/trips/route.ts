import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const busId = searchParams.get('busId')

    const where: any = {}
    if (status) where.status = status
    if (busId) where.busId = busId

    const trips = await db.trip.findMany({
      where,
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
        },
        bookings: {
          include: {
            user: true,
            station: true
          }
        }
      },
      orderBy: {
        departureTime: 'desc'
      }
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { busId, departureTime, arrivalTime, price, supervisorId, stations } = body

    const trip = await db.trip.create({
      data: {
        busId,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price,
        supervisorId
      }
    })

    // Add trip stations if provided
    if (stations && Array.isArray(stations)) {
      for (let i = 0; i < stations.length; i++) {
        const station = stations[i]
        await db.tripStation.create({
          data: {
            tripId: trip.id,
            stationId: station.stationId,
            stopOrder: i,
            arrivalTime: new Date(station.arrivalTime),
            departureTime: new Date(station.departureTime)
          }
        })
      }
    }

    const fullTrip = await db.trip.findUnique({
      where: { id: trip.id },
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
    })

    return NextResponse.json(fullTrip, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}