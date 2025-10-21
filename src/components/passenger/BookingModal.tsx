"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MapPin, 
  Clock, 
  Bus, 
  Users, 
  Star,
  CreditCard,
  Wallet,
  QrCode,
  X,
  CheckCircle
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Station {
  id: string
  name: string
  address?: string
  latitude: number
  longitude: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Trip {
  id: string
  busId: string
  departureTime: string
  arrivalTime: string
  status: string
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  bus: {
    id: string
    plateNumber: string
    type: string
    capacity: number
    photoUrl?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  tripStations: Array<{
    station: Station
    stopOrder: number
    arrivalTime: string
    departureTime: string
  }>
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  station: Station | null
  trip: Trip | null
}

export default function BookingModal({ isOpen, onClose, station, trip }: BookingModalProps) {
  const { t } = useLanguage()
  const [selectedSeat, setSelectedSeat] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet')
  const [isBooking, setIsBooking] = useState(false)

  if (!isOpen || !station || !trip) return null

  const handleBooking = async () => {
    if (!selectedSeat) {
      alert(t('pleaseSelectSeat') || 'Please select a seat')
      return
    }

    setIsBooking(true)
    try {
      // In a real app, this would call the booking API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '1', // Mock user ID
          tripId: trip.id,
          stationId: station.id,
          totalPrice: trip.price,
          paymentMethod: paymentMethod === 'wallet' ? 'WALLET' : 'CARD'
        })
      })

      if (response.ok) {
        const booking = await response.json()
        alert(t('bookingSuccess') || 'Booking successful!')
        onClose()
      } else {
        alert(t('bookingFailed') || 'Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert(t('bookingError') || 'Booking error')
    } finally {
      setIsBooking(false)
    }
  }

  const generateSeats = () => {
    const seats = []
    const capacity = trip.bus.capacity
    const rows = Math.ceil(capacity / 4)
    
    for (let row = 0; row < rows; row++) {
      for (let seat = 0; seat < 4; seat++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${seat + 1}`
        if (seats.length < capacity) {
          seats.push(seatNumber)
        }
      }
    }
    return seats
  }

  const seats = generateSeats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{t('bookTrip') || 'Book Trip'}</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {station.name} → {trip.tripStations[trip.tripStations.length - 1]?.station.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Trip Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{t('tripDetails') || 'Trip Details'}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('from') || 'From'}</span>
                  <div className="font-medium">{station.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('to') || 'To'}</span>
                  <div className="font-medium">{trip.tripStations[trip.tripStations.length - 1]?.station.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('departure') || 'Departure'}</span>
                  <div className="font-medium">{new Date(trip.departureTime).toLocaleTimeString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('arrival') || 'Arrival'}</span>
                  <div className="font-medium">{new Date(trip.arrivalTime).toLocaleTimeString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('bus') || 'Bus'}</span>
                  <div className="font-medium">{trip.bus.plateNumber}</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('price') || 'Price'}</span>
                  <div className="font-medium text-lg text-blue-600">EGP {trip.price}</div>
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('selectSeat') || 'Select Seat'}</h3>
              <div className="grid grid-cols-4 gap-2 max-w-md">
                {seats.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      selectedSeat === seat
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
              {selectedSeat && (
                <div className="mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  {t('seatSelected') || 'Seat selected'}: {selectedSeat}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('paymentMethod') || 'Payment Method'}</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                    className="mr-3"
                  />
                  <Wallet className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div className="font-medium">{t('wallet') || 'Wallet'}</div>
                    <div className="text-sm text-gray-500">{t('useWalletBalance') || 'Use wallet balance'}</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'card')}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <div className="font-medium">{t('creditCard') || 'Credit Card'}</div>
                    <div className="text-sm text-gray-500">{t('payWithCard') || 'Pay with credit card'}</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{t('bookingSummary') || 'Booking Summary'}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('seat') || 'Seat'}</span>
                  <span className="font-medium">{selectedSeat || t('notSelected') || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('paymentMethod') || 'Payment Method'}</span>
                  <span className="font-medium">{paymentMethod === 'wallet' ? t('wallet') : t('creditCard')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">{t('total') || 'Total'}</span>
                  <span className="font-bold text-lg text-blue-600">EGP {trip.price}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                {t('cancel') || 'Cancel'}
              </Button>
              <Button 
                onClick={handleBooking}
                disabled={!selectedSeat || isBooking}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isBooking ? t('processing') || 'Processing...' : t('confirmBooking') || 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}