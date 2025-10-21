'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  AlertTriangle, 
  Bus, 
  Clock, 
  MapPin, 
  Navigation, 
  Users,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useSupervisorSocket } from '@/hooks/useSupervisorSocket'

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

export default function RealTimeTracking() {
  const { 
    isConnected, 
    busLocations, 
    tripStatuses, 
    alerts, 
    delays, 
    realTimeData 
  } = useSupervisorSocket()

  const [busStatuses, setBusStatuses] = useState<BusStatus[]>([
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
  ])

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
      case 'active': return <Activity className="h-5 w-5" />
      case 'delayed': return <Clock className="h-5 w-5" />
      case 'maintenance': return <AlertTriangle className="h-5 w-5" />
      case 'offline': return <WifiOff className="h-5 w-5" />
      default: return <Bus className="h-5 w-5" />
    }
  }

  const activeBuses = busStatuses.filter(bus => bus.status === 'active').length
  const delayedBuses = busStatuses.filter(bus => bus.status === 'delayed').length
  const totalPassengers = busStatuses.reduce((sum, bus) => sum + bus.passengers, 0)
  const totalCapacity = busStatuses.reduce((sum, bus) => sum + bus.capacity, 0)
  const occupancyRate = Math.round((totalPassengers / totalCapacity) * 100)

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Real-time Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Disconnected</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Last update: {realTimeData?.timestamp ? new Date(realTimeData.timestamp).toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-blue-600">
                  {realTimeData?.activeBuses || activeBuses}
                </p>
              </div>
              <Bus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-green-600">
                  {realTimeData?.activeTrips || tripStatuses.size}
                </p>
              </div>
              <Navigation className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {realTimeData?.totalPassengers || totalPassengers}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-yellow-600">{occupancyRate}%</p>
              </div>
              <div className="relative">
                <Progress value={occupancyRate} className="h-2 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Bus Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Live Bus Tracking
          </CardTitle>
          <CardDescription>
            Real-time bus locations and status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {busStatuses.map((bus) => {
              const busLocation = busLocations.get(bus.id)
              return (
                <div key={bus.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{bus.plateNumber}</h3>
                      <p className="text-sm text-gray-600">{bus.driver}</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(bus.status)}`}>
                      {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {busLocation ? `${busLocation.latitude.toFixed(4)}, ${busLocation.longitude.toFixed(4)}` : bus.currentLocation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium">{busLocation ? `${busLocation.speed} km/h` : `${bus.speed} km/h`}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">{bus.passengers}/{bus.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Stop:</span>
                      <span className="font-medium">{bus.nextStop}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{bus.lastUpdate}</span>
                      {busLocation && (
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1 text-green-500" />
                          Live
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Recent Alerts
          </CardTitle>
          <CardDescription>
            Latest system alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-100' :
                  alert.severity === 'high' ? 'bg-orange-100' :
                  alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`text-xs ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}