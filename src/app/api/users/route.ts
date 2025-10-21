import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    const where: any = {}
    if (role) where.role = role.toUpperCase()
    if (status) where.isActive = status === 'active'

    const users = await db.user.findMany({
      where,
      include: {
        bookings: {
          include: {
            trip: {
              include: {
                bus: true
              }
            },
            station: true
          }
        },
        wallets: true,
        subscriptions: true,
        createdTrips: {
          include: {
            bus: true,
            tripStations: {
              include: {
                station: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone, role } = body

    const user = await db.user.create({
      data: {
        email,
        name,
        phone,
        role: role ? role.toUpperCase() : 'PASSENGER'
      },
      include: {
        wallets: true,
        subscriptions: true
      }
    })

    // Create wallet for the user
    await db.wallet.create({
      data: {
        userId: user.id,
        balance: 0
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}