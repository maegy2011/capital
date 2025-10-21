"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bus, 
  Users, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Navigation,
  Settings,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  Activity,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Wrench,
  User,
  LogOut
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface BusStatus {
  id: string
  plateNumber: string
  driver: string
  currentLocation: string
  nextStop: string
  passengers: number
  capacity: number
  status: 'active' | 'delayed' | 'maintenance' | 'offline'
  lastUpdate: string
  speed: number
}

const busStatuses: BusStatus[] = [
  {
    id: '1',
    plateNumber: 'CA 1234',
    driver: 'Ahmed Hassan',
    currentLocation: 'Tahrir Square',
    nextStop: 'Nasr City',
    passengers: 18,
    capacity: 30,
    status: 'active',
    lastUpdate: '2 min ago',
    speed: 45
  },
  {
    id: '2',
    plateNumber: 'CA 5678',
    driver: 'Mohamed Ali',
    currentLocation: 'Nasr City',
    nextStop: 'Heliopolis',
    passengers: 25,
    capacity: 30,
    status: 'delayed',
    lastUpdate: '1 min ago',
    speed: 35
  },
  {
    id: '3',
    plateNumber: 'CA 9012',
    driver: 'Sara Mahmoud',
    currentLocation: 'Heliopolis',
    nextStop: 'Admin Capital',
    passengers: 12,
    capacity: 30,
    status: 'active',
    lastUpdate: '3 min ago',
    speed: 50
  }
]

export default function BusMonitoring() {
  const { t, isRTL } = useLanguage()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'delayed': return 'bg-yellow-100 text-yellow-700'
      case 'maintenance': return 'bg-orange-100 text-orange-700'
      case 'offline': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5" />
      case 'delayed': return <Clock className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      case 'offline': return <AlertTriangle className="h-5 w-5" />
      default: return <Bus className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active') || 'Active'
      case 'delayed': return t('delay') || 'Delayed'
      case 'maintenance': return t('maintenance') || 'Maintenance'
      case 'offline': return t('offline') || 'Offline'
      default: return status
    }
  }

  const activeBuses = busStatuses.filter(bus => bus.status === 'active').length
  const delayedBuses = busStatuses.filter(bus => bus.status === 'delayed').length
  const totalPassengers = busStatuses.reduce((sum, bus) => sum + bus.passengers, 0)
  const totalCapacity = busStatuses.reduce((sum, bus) => sum + bus.capacity, 0)
  const occupancyRate = Math.round((totalPassengers / totalCapacity) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('supervisor')} - {t('busMonitoring') || 'Bus Monitoring'}</p>
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
            {t('busMonitoring') || 'Bus Monitoring'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('realTimeBusTracking') || 'Real-time bus tracking and monitoring'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Bus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('activeBuses')}</p>
                    <p className="text-2xl font-bold text-gray-900">{activeBuses}/{busStatuses.length}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('occupancyRate') || 'Occupancy Rate'}</p>
                    <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
                  </div>
                </div>
                <BarChart3 className="h-5 w-5 text-blue-500" />
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
                    <p className="text-sm text-gray-500">{t('delayedBuses') || 'Delayed Buses'}</p>
                    <p className="text-2xl font-bold text-gray-900">{delayedBuses}</p>
                  </div>
                </div>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Navigation className="h-6 w-6 text-purple-600" />
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

        {/* Bus Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {busStatuses.map((bus) => (
            <Card key={bus.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{bus.plateNumber}</CardTitle>
                  <Badge className={`text-xs ${getStatusColor(bus.status)}`}>
                    {getStatusText(bus.status)}
                  </Badge>
                </div>
                <CardDescription>{bus.driver}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getStatusColor(bus.status)}`}>
                        {getStatusIcon(bus.status)}
                      </div>
                      <span className="text-sm text-gray-600">{bus.lastUpdate}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {bus.passengers}/{bus.capacity}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((bus.passengers / bus.capacity) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('currentLocation') || 'Current Location'}</span>
                      <span className="font-medium">{bus.currentLocation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('nextStop') || 'Next Stop'}</span>
                      <span className="font-medium">{bus.nextStop}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t('speed') || 'Speed'}</span>
                      <span className="font-medium">{bus.speed} km/h</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      {t('viewDetails') || 'View Details'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map View Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              {t('liveMap') || 'Live Map View'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('mapPlaceholder') || 'Interactive map will be displayed here'}</p>
                <p className="text-sm text-gray-400 mt-2">{t('showingBusLocations') || 'Showing real-time bus locations'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}