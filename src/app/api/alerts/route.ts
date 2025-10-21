import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const busId = searchParams.get('busId')

    const where: any = {}
    if (severity) where.severity = severity
    if (type) where.type = type
    if (status) where.resolved = status === 'resolved'
    if (busId) where.busId = busId

    const alerts = await db.alert.findMany({
      where,
      include: {
        bus: {
          include: {
            supervisor: true
          }
        },
        resolvedBy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      type, 
      severity, 
      title, 
      description, 
      busId, 
      location,
      actionRequired 
    } = body

    const alert = await db.alert.create({
      data: {
        type,
        severity,
        title,
        description,
        busId,
        location,
        actionRequired: actionRequired || false
      },
      include: {
        bus: true
      }
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, resolved, resolvedById } = body

    const alert = await db.alert.update({
      where: { id },
      data: {
        resolved,
        resolvedAt: resolved ? new Date() : null,
        resolvedById
      },
      include: {
        bus: true,
        resolvedBy: true
      }
    })

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}