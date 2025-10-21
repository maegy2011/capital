import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { isActive: status === 'active' } : {}

    const buses = await db.bus.findMany({
      where,
      include: {
        trips: {
          include: {
            supervisor: true,
            tripStations: {
              include: {
                station: true
              }
            },
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(buses)
  } catch (error) {
    console.error('Error fetching buses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plateNumber, type, capacity, photoUrl } = body

    const bus = await db.bus.create({
      data: {
        plateNumber,
        type,
        capacity,
        photoUrl
      }
    })

    return NextResponse.json(bus, { status: 201 })
  } catch (error) {
    console.error('Error creating bus:', error)
    return NextResponse.json(
      { error: 'Failed to create bus' },
      { status: 500 }
    )
  }
}