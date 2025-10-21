import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get basic counts
    const [totalUsers, totalBuses, activeBuses, totalTrips, todayTrips] = await Promise.all([
      db.user.count(),
      db.bus.count(),
      db.bus.count({ where: { isActive: true } }),
      db.trip.count(),
      db.trip.count({
        where: {
          departureTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      })
    ])

    // All users are considered active for now since User model doesn't have isActive field
    const activeUsers = totalUsers

    // Get revenue data
    const bookings = await db.booking.findMany({
      where: {
        status: 'COMPLETED'
      },
      select: {
        totalPrice: true,
        createdAt: true
      }
    })

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
    
    const todayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      const today = new Date()
      return bookingDate.toDateString() === today.toDateString()
    })
    
    const todayRevenue = todayBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    // Get user counts by role
    const userByRole = await db.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })

    // Get trip status counts
    const tripByStatus = await db.trip.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get recent activity
    const recentBookings = await db.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        trip: {
          include: {
            bus: true
          }
        }
      }
    })

    const analytics = {
      stats: {
        totalUsers,
        activeUsers,
        totalBuses,
        activeBuses,
        totalTrips,
        todayTrips,
        totalRevenue,
        todayRevenue
      },
      userByRole,
      tripByStatus,
      recentBookings
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}