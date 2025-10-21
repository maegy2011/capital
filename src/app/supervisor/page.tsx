"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
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
  LogOut,
  ArrowRight,
  Monitor,
  Database,
  CreditCard,
  Ticket,
  Wallet
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'
import Link from 'next/link'

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
}

interface Alert {
  id: string
  type: 'delay' | 'maintenance' | 'emergency' | 'passenger-issue'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  bus: string
  time: string
  resolved: boolean
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
    progress: 65
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
    progress: 40
  }
]

const alerts: Alert[] = [
  {
    id: '1',
    type: 'delay',
    severity: 'medium',
    title: 'Bus CA 5678 Delayed',
    description: 'Bus is running 15 minutes behind schedule due to traffic',
    bus: 'CA 5678',
    time: '5 min ago',
    resolved: false
  },
  {
    id: '2',
    type: 'maintenance',
    severity: 'high',
    title: 'Maintenance Required',
    description: 'Bus CA 9012 needs scheduled maintenance within 100km',
    bus: 'CA 9012',
    time: '1 hour ago',
    resolved: false
  }
]

export default function SupervisorDashboard() {
  const { t, isRTL } = useLanguage()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'buses' | 'trips' | 'alerts'>('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'delayed': return 'bg-yellow-100 text-yellow-700'
      case 'maintenance': return 'bg-orange-100 text-orange-700'
      case 'offline': return 'bg-red-100 text-red-700'
      case 'on-time': return 'bg-green-100 text-green-700'
      case 'early': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'critical': return 'bg-red-100 text-red-700'
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
      case 'on-time': return t('onTime') || 'On Time'
      case 'early': return 'Early'
      case 'cancelled': return t('cancel') || 'Cancelled'
      default: return status
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Low'
      case 'medium': return 'Medium'
      case 'high': return 'High'
      case 'critical': return 'Critical'
      default: return severity
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
                  <p className="text-sm text-gray-500">{t('supervisor')}</p>
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
            {t('supervisorDashboard') || 'Supervisor Dashboard'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('realTimeMonitoring') || 'Real-time fleet monitoring and management'}
          </p>
        </div>

        {/* Quick Access Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/supervisor/bus-monitoring">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Bus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('busMonitoring') || 'Bus Monitoring'}</h3>
                    <p className="text-sm text-gray-500">{t('trackBusLocations') || 'Track bus locations in real-time'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/supervisor/trip-tracking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Navigation className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('tripTracking') || 'Trip Tracking'}</h3>
                    <p className="text-sm text-gray-500">{t('monitorTripProgress') || 'Monitor trip progress and schedules'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/supervisor/alert-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('alertManagement') || 'Alert Management'}</h3>
                    <p className="text-sm text-gray-500">{t('manageSystemAlerts') || 'Manage system alerts and incidents'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
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
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('alerts')}</p>
                    <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                  </div>
                </div>
                <Zap className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{t('overview') || 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger value="buses" className="flex items-center space-x-2">
              <Bus className="h-4 w-4" />
              <span>{t('buses') || 'Buses'}</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>{t('trips') || 'Trips'}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{t('alerts')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Buses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    {t('activeBuses')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {busStatuses.map((bus) => (
                      <div key={bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${getStatusColor(bus.status)}`}>
                            {getStatusIcon(bus.status)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{bus.plateNumber}</h4>
                            <p className="text-sm text-gray-500">{bus.driver}</p>
                            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {bus.currentLocation}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span>{bus.nextStop}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {bus.passengers}/{bus.capacity}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bus.speed} km/h
                          </div>
                          <Badge className={`text-xs mt-1 ${getStatusColor(bus.status)}`}>
                            {getStatusText(bus.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    {t('recentAlerts') || 'Recent Alerts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <p className="text-sm text-gray-500">{alert.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{alert.bus}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{alert.time}</div>
                          {!alert.resolved && (
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1 ml-auto"></div>
                          )}
                          <Badge className={`text-xs mt-1 ${getSeverityColor(alert.severity)}`}>
                            {getSeverityText(alert.severity)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bus className="h-5 w-5 mr-2 text-blue-600" />
                  {t('fleetOverview') || 'Fleet Overview'}
                </CardTitle>
                <CardDescription>
                  {t('allBusStatuses') || 'Real-time status of all buses in the fleet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {busStatuses.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(bus.status)}`}>
                          {getStatusIcon(bus.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{bus.plateNumber}</h4>
                          <p className="text-sm text-gray-500">{bus.driver}</p>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {bus.currentLocation}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span>{bus.nextStop}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {bus.passengers}/{bus.capacity}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bus.speed} km/h
                        </div>
                        <Badge className={`text-xs mt-1 ${getStatusColor(bus.status)}`}>
                          {getStatusText(bus.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-green-600" />
                  {t('activeTrips') || 'Active Trips'}
                </CardTitle>
                <CardDescription>
                  {t('monitorTripProgress') || 'Monitor progress of all active trips'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tripStatuses.map((trip) => (
                    <div key={trip.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{trip.route}</h4>
                        <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">{t('bus') || 'Bus'}</span>
                          <div className="font-medium">{trip.bus}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">{t('driver') || 'Driver'}</span>
                          <div className="font-medium">{trip.driver}</div>
                        </div>
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
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('progress') || 'Progress'}</span>
                          <span className="font-medium">{trip.progress}%</span>
                        </div>
                        <Progress value={trip.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{trip.passengers} {t('passengers') || 'passengers'}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {t('viewDetails') || 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  {t('systemAlerts') || 'System Alerts'}
                </CardTitle>
                <CardDescription>
                  {t('allSystemAlerts') || 'Monitor and manage all system alerts'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-500">{alert.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{alert.bus}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{alert.time}</div>
                        {!alert.resolved && (
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1 ml-auto"></div>
                        )}
                        <Badge className={`text-xs mt-1 ${getSeverityColor(alert.severity)}`}>
                          {getSeverityText(alert.severity)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}