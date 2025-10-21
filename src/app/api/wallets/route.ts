import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where: any = {}
    if (userId) where.userId = userId

    const wallets = await db.wallet.findMany({
      where,
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(wallets)
  } catch (error) {
    console.error('Error fetching wallets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, balance, currency } = body

    const wallet = await db.wallet.create({
      data: {
        userId,
        balance: balance || 0,
        currency: currency || 'EGP'
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(wallet, { status: 201 })
  } catch (error) {
    console.error('Error creating wallet:', error)
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletId, amount, operation } = body

    const wallet = await db.wallet.findUnique({
      where: { id: walletId }
    })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    let newBalance = wallet.balance
    if (operation === 'add') {
      newBalance += amount
    } else if (operation === 'subtract') {
      if (wallet.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient funds' },
          { status: 400 }
        )
      }
      newBalance -= amount
    }

    const updatedWallet = await db.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
      include: {
        user: true
      }
    })

    return NextResponse.json(updatedWallet)
  } catch (error) {
    console.error('Error updating wallet:', error)
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    )
  }
}