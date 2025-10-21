import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const busId = searchParams.get('busId')
    const tripId = searchParams.get('tripId')

    const where: any = {}
    if (status) where.status = status
    if (busId) where.busId = busId
    if (tripId) where.tripId = tripId

    const delays = await db.delay.findMany({
      where,
      include: {
        bus: true,
        trip: {
          include: {
            supervisor: true,
            tripStations: {
              include: {
                station: true
              }
            }
          }
        },
        resolvedBy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(delays)
  } catch (error) {
    console.error('Error fetching delays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delays' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      tripId, 
      busId, 
      delayMinutes, 
      reason, 
      description,
      affectedStations 
    } = body

    const delay = await db.delay.create({
      data: {
        tripId,
        busId,
        delayMinutes,
        reason,
        description
      },
      include: {
        bus: true,
        trip: true
      }
    })

    // Create delay stations if provided
    if (affectedStations && Array.isArray(affectedStations)) {
      for (const station of affectedStations) {
        await db.delayStation.create({
          data: {
            delayId: delay.id,
            stationId: station.stationId,
            estimatedDelay: station.estimatedDelay
          }
        })
      }
    }

    const fullDelay = await db.delay.findUnique({
      where: { id: delay.id },
      include: {
        bus: true,
        trip: {
          include: {
            supervisor: true,
            tripStations: {
              include: {
                station: true
              }
            }
          }
        },
        delayStations: {
          include: {
            station: true
          }
        },
        resolvedBy: true
      }
    })

    return NextResponse.json(fullDelay, { status: 201 })
  } catch (error) {
    console.error('Error creating delay:', error)
    return NextResponse.json(
      { error: 'Failed to create delay' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, resolvedById, resolutionNotes } = body

    const delay = await db.delay.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
        resolvedById,
        resolutionNotes
      },
      include: {
        bus: true,
        trip: {
          include: {
            supervisor: true,
            tripStations: {
              include: {
                station: true
              }
            }
          }
        },
        delayStations: {
          include: {
            station: true
          }
        },
        resolvedBy: true
      }
    })

    return NextResponse.json(delay)
  } catch (error) {
    console.error('Error updating delay:', error)
    return NextResponse.json(
      { error: 'Failed to update delay' },
      { status: 500 }
    )
  }
}