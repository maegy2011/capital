"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Navigation, 
  Clock, 
  Bus, 
  Users, 
  MapPin,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Edit,
  MessageSquare,
  Zap,
  Activity
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface TripStatus {
  id: string
  route: string
  bus: string
  driver: string
  scheduledTime: string
  actualTime: string
  status: 'on-time' | 'delayed' | 'early' | 'cancelled'
  passengers: number
  progress: number
  currentLocation: string
  nextStop: string
  estimatedArrival: string
}

const tripStatuses: TripStatus[] = [
  {
    id: '1',
    route: 'Tahrir → Admin Capital',
    bus: 'CA 1234',
    driver: 'Ahmed Hassan',
    scheduledTime: '08:00',
    actualTime: '08:05',
    status: 'delayed',
    passengers: 18,
    progress: 65,
    currentLocation: 'Nasr City',
    nextStop: 'Heliopolis',
    estimatedArrival: '08:45'
  },
  {
    id: '2',
    route: 'Nasr City → Admin Capital',
    bus: 'CA 5678',
    driver: 'Mohamed Ali',
    scheduledTime: '08:30',
    actualTime: '08:30',
    status: 'on-time',
    passengers: 25,
    progress: 40,
    currentLocation: 'Heliopolis',
    nextStop: 'Admin Capital',
    estimatedArrival: '09:15'
  },
  {
    id: '3',
    route: 'Maadi → Admin Capital',
    bus: 'CA 9012',
    driver: 'Sara Mahmoud',
    scheduledTime: '09:00',
    actualTime: '08:55',
    status: 'early',
    passengers: 12,
    progress: 25,
    currentLocation: 'Maadi',
    nextStop: 'Tahrir Square',
    estimatedArrival: '09:40'
  }
]

export default function TripTracking() {
  const { t, isRTL } = useLanguage()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-700'
      case 'delayed': return 'bg-yellow-100 text-yellow-700'
      case 'early': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time': return <CheckCircle className="h-5 w-5" />
      case 'delayed': return <Clock className="h-5 w-5" />
      case 'early': return <Zap className="h-5 w-5" />
      case 'cancelled': return <AlertTriangle className="h-5 w-5" />
      default: return <Navigation className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time': return t('onTime') || 'On Time'
      case 'delayed': return t('delay') || 'Delayed'
      case 'early': return 'Early'
      case 'cancelled': return t('cancel') || 'Cancelled'
      default: return status
    }
  }

  const onTimeTrips = tripStatuses.filter(trip => trip.status === 'on-time').length
  const delayedTrips = tripStatuses.filter(trip => trip.status === 'delayed').length
  const totalPassengers = tripStatuses.reduce((sum, trip) => sum + trip.passengers, 0)
  const avgProgress = Math.round(tripStatuses.reduce((sum, trip) => sum + trip.progress, 0) / tripStatuses.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('supervisor')} - {t('tripTracking') || 'Trip Tracking'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-green-600 text-white">AS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('tripTracking') || 'Trip Tracking'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('monitorTripProgress') || 'Monitor trip progress and schedule adherence'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Navigation className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('activeTrips') || 'Active Trips'}</p>
                    <p className="text-2xl font-bold text-gray-900">{tripStatuses.length}</p>
                  </div>
                </div>
                <Activity className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('onTimeTrips') || 'On-Time Trips'}</p>
                    <p className="text-2xl font-bold text-gray-900">{onTimeTrips}/{tripStatuses.length}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('delayedTrips') || 'Delayed Trips'}</p>
                    <p className="text-2xl font-bold text-gray-900">{delayedTrips}</p>
                  </div>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalPassengers') || 'Total Passengers'}</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPassengers}</p>
                  </div>
                </div>
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Tracking Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tripStatuses.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{trip.route}</CardTitle>
                  <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
                    {getStatusText(trip.status)}
                  </Badge>
                </div>
                <CardDescription>{t('bus') || 'Bus'} {trip.bus} - {trip.driver}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('tripProgress') || 'Trip Progress'}</span>
                      <span className="font-medium">{trip.progress}%</span>
                    </div>
                    <Progress value={trip.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{t('scheduled') || 'Scheduled'}</span>
                      <div className="font-medium">{trip.scheduledTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('actual') || 'Actual'}</span>
                      <div className="font-medium">{trip.actualTime}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('currentLocation') || 'Current Location'}</span>
                      <span className="font-medium">{trip.currentLocation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('nextStop') || 'Next Stop'}</span>
                      <span className="font-medium">{trip.nextStop}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('estimatedArrival') || 'Estimated Arrival'}</span>
                      <span className="font-medium">{trip.estimatedArrival}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{trip.passengers} {t('passengers') || 'passengers'}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {t('viewDetails') || 'View Details'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Route Map Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              {t('routeVisualization') || 'Route Visualization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('routeMapPlaceholder') || 'Interactive route map will be displayed here'}</p>
                <p className="text-sm text-gray-400 mt-2">{t('showingActiveRoutes') || 'Showing active routes and real-time positions'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}