"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  Bus, 
  Users, 
  Star,
  Navigation,
  ArrowRight,
  Calendar
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

interface TripCardProps {
  trip: Trip
  onBookTrip: (trip: Trip) => void
}

export default function TripCard({ trip, onBookTrip }: TripCardProps) {
  const { t } = useLanguage()

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-700'
      case 'IN_PROGRESS': return 'bg-green-100 text-green-700'
      case 'COMPLETED': return 'bg-gray-100 text-gray-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      case 'DELAYED': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SCHEDULED': return t('scheduled') || 'Scheduled'
      case 'IN_PROGRESS': return t('inProgress') || 'In Progress'
      case 'COMPLETED': return t('completed') || 'Completed'
      case 'CANCELLED': return t('cancel') || 'Cancelled'
      case 'DELAYED': return t('delay') || 'Delayed'
      default: return status
    }
  }

  const getBusTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'STANDARD': return 'bg-gray-100 text-gray-700'
      case 'DELUXE': return 'bg-purple-100 text-purple-700'
      case 'VIP': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const fromStation = trip.tripStations[0]?.station
  const toStation = trip.tripStations[trip.tripStations.length - 1]?.station

  if (!fromStation || !toStation) return null

  const departureTime = new Date(trip.departureTime)
  const arrivalTime = new Date(trip.arrivalTime)
  const duration = Math.round((arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60)) // minutes

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-blue-600" />
            {fromStation.name} → {toStation.name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
              {getStatusText(trip.status)}
            </Badge>
            <Badge className={`text-xs ${getBusTypeColor(trip.bus.type)}`}>
              {trip.bus.type}
            </Badge>
          </div>
        </div>
        <CardDescription>
          {trip.bus.plateNumber} • {trip.bus.capacity} {t('seats') || 'seats'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Time and Duration */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('departure') || 'Departure'}</span>
            </div>
            <div className="font-medium">{departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('arrival') || 'Arrival'}</span>
            </div>
            <div className="font-medium">{arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('duration') || 'Duration'}</span>
            </div>
            <div className="font-medium">{duration} min</div>
          </div>

          {/* Bus Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Bus className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('bus') || 'Bus'}</span>
            </div>
            <div className="font-medium">{trip.bus.plateNumber}</div>
          </div>

          {/* Available Seats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('availableSeats') || 'Available Seats'}</span>
            </div>
            <div className="font-medium">{trip.bus.capacity}</div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-lg font-bold text-blue-600">
              EGP {trip.price}
            </div>
            <Button 
              onClick={() => onBookTrip(trip)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={trip.status !== 'SCHEDULED'}
            >
              {trip.status === 'SCHEDULED' ? (t('bookNow') || 'Book Now') : (t('notAvailable') || 'Not Available')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}