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
  Calendar,
  Route
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
  tripStations?: Array<{
    trip: {
      bus: {
        plateNumber: string
        type: string
        capacity: number
      }
    }
  }>
  bookings?: Array<{
    user: {
      name: string
    }
  }>
}

interface StationCardProps {
  station: Station
  onViewTrips: (station: Station) => void
}

export default function StationCard({ station, onViewTrips }: StationCardProps) {
  const { t } = useLanguage()

  const routeCount = station.tripStations?.length || 0
  const bookingCount = station.bookings?.length || 0

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            {station.name}
          </CardTitle>
          <Badge className={`text-xs ${station.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {station.isActive ? (t('active') || 'Active') : (t('inactive') || 'Inactive')}
          </Badge>
        </div>
        <CardDescription>
          {station.address || station.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Location Info */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}</span>
          </div>

          {/* Route Count */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Route className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('availableRoutes') || 'Available Routes'}</span>
            </div>
            <div className="font-medium">{routeCount}</div>
          </div>

          {/* Booking Count */}
          {bookingCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-gray-600">{t('totalBookings') || 'Total Bookings'}</span>
              </div>
              <div className="font-medium">{bookingCount}</div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-600">{t('available') || 'Available'}</span>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => onViewTrips(station)}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!station.isActive || routeCount === 0}
          >
            {t('viewAvailableTrips') || 'View Available Trips'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}