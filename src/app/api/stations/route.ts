import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = { isActive: true }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const stations = await db.station.findMany({
      where,
      include: {
        tripStations: {
          include: {
            trip: {
              include: {
                bus: true
              }
            }
          }
        },
        bookings: {
          include: {
            user: true,
            trip: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(stations)
  } catch (error) {
    console.error('Error fetching stations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, latitude, longitude, description } = body

    const station = await db.station.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        description
      }
    })

    return NextResponse.json(station, { status: 201 })
  } catch (error) {
    console.error('Error creating station:', error)
    return NextResponse.json(
      { error: 'Failed to create station' },
      { status: 500 }
    )
  }
}