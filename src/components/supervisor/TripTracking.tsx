'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Activity,
  Route,
  Play,
  Pause,
  BarChart3,
  Timer
} from 'lucide-react'
import { useSupervisorSocket } from '@/hooks/useSupervisorSocket'

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
  coordinates?: {
    lat: number
    lng: number
  }
}

interface RouteStop {
  id: string
  name: string
  address: string
  arrivalTime: string
  departureTime: string
  status: 'pending' | 'arrived' | 'departed'
  coordinates: {
    lat: number
    lng: number
  }
}

export default function TripTracking() {
  const { tripStatuses, isConnected } = useSupervisorSocket()
  const [trips, setTrips] = useState<TripStatus[]>([
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
  ])

  const [selectedTrip, setSelectedTrip] = useState<TripStatus | null>(null)
  const [routeStops, setRouteStops] = useState<RouteStop[]>([
    {
      id: '1',
      name: 'Tahrir Square',
      address: 'Central Cairo',
      arrivalTime: '08:00',
      departureTime: '08:05',
      status: 'departed',
      coordinates: { lat: 30.0444, lng: 31.2357 }
    },
    {
      id: '2',
      name: 'Nasr City',
      address: 'Eastern Cairo',
      arrivalTime: '08:20',
      departureTime: '08:25',
      status: 'arrived',
      coordinates: { lat: 30.0458, lng: 31.3245 }
    },
    {
      id: '3',
      name: 'Heliopolis',
      address: 'Northeastern Cairo',
      arrivalTime: '08:40',
      departureTime: '08:45',
      status: 'pending',
      coordinates: { lat: 30.0891, lng: 31.3264 }
    },
    {
      id: '4',
      name: 'Administrative Capital',
      address: 'Final Destination',
      arrivalTime: '09:00',
      departureTime: '09:05',
      status: 'pending',
      coordinates: { lat: 30.0143, lng: 31.4587 }
    }
  ])

  // Update trips with real-time data
  useEffect(() => {
    const updatedTrips = trips.map(trip => {
      const realTimeStatus = tripStatuses.get(trip.id)
      if (realTimeStatus) {
        return {
          ...trip,
          status: realTimeStatus.status as TripStatus['status'],
          currentLocation: realTimeStatus.currentLocation,
          nextStop: realTimeStatus.nextStop,
          estimatedArrival: realTimeStatus.estimatedArrival
        }
      }
      return trip
    })
    setTrips(updatedTrips)
  }, [tripStatuses])

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

  const getStopStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'bg-green-100 text-green-700'
      case 'departed': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const onTimeTrips = trips.filter(trip => trip.status === 'on-time').length
  const delayedTrips = trips.filter(trip => trip.status === 'delayed').length
  const totalPassengers = trips.reduce((sum, trip) => sum + trip.passengers, 0)
  const avgProgress = Math.round(trips.reduce((sum, trip) => sum + trip.progress, 0) / trips.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trip Tracking</h2>
          <p className="text-gray-600">Monitor trip progress and schedule adherence</p>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-1 text-green-600">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Live</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <Timer className="h-4 w-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Navigation className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
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
                  <p className="text-sm text-gray-600">On-Time Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{onTimeTrips}/{trips.length}</p>
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
                  <p className="text-sm text-gray-600">Delayed Trips</p>
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
                  <p className="text-sm text-gray-600">Total Passengers</p>
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
        {trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{trip.route}</CardTitle>
                <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1).replace('-', ' ')}
                </Badge>
              </div>
              <CardDescription>Bus {trip.bus} - {trip.driver}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trip Progress</span>
                    <span className="font-medium">{trip.progress}%</span>
                  </div>
                  <Progress value={trip.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Scheduled</span>
                    <div className="font-medium">{trip.scheduledTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual</span>
                    <div className="font-medium">{trip.actualTime}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Location</span>
                    <span className="font-medium">{trip.currentLocation}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next Stop</span>
                    <span className="font-medium">{trip.nextStop}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estimated Arrival</span>
                    <span className="font-medium">{trip.estimatedArrival}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{trip.passengers} passengers</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
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

      {/* Route Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="h-5 w-5 mr-2 text-blue-600" />
            Route Visualization
          </CardTitle>
          <CardDescription>
            Interactive route map with real-time bus positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive route map will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Showing active routes and real-time positions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details Dialog */}
      {selectedTrip && (
        <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {getStatusIcon(selectedTrip.status)}
                <span className="ml-2">Trip Details - {selectedTrip.route}</span>
              </DialogTitle>
              <DialogDescription>
                Complete trip information and route details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Trip Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Bus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm text-gray-600">Bus</div>
                      <div className="font-semibold">{selectedTrip.bus}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm text-gray-600">Passengers</div>
                      <div className="font-semibold">{selectedTrip.passengers}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="font-semibold">{selectedTrip.progress}%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <div className="font-medium">{selectedTrip.scheduledTime}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Actual</span>
                      <div className="font-medium">{selectedTrip.actualTime}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Current Location</span>
                      <div className="font-medium">{selectedTrip.currentLocation}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Estimated Arrival</span>
                      <div className="font-medium">{selectedTrip.estimatedArrival}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Route Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-medium">{selectedTrip.progress}%</span>
                      </div>
                      <Progress value={selectedTrip.progress} className="h-3" />
                    </div>

                    <div className="space-y-3">
                      {routeStops.map((stop, index) => (
                        <div key={stop.id} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              stop.status === 'departed' ? 'bg-blue-100 text-blue-700' :
                              stop.status === 'arrived' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{stop.name}</h4>
                                <p className="text-sm text-gray-600">{stop.address}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={`text-xs ${getStopStatusColor(stop.status)}`}>
                                  {stop.status}
                                </Badge>
                                <div className="text-xs text-gray-500 mt-1">
                                  {stop.arrivalTime}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Position */}
              {selectedTrip.coordinates && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Lat: {selectedTrip.coordinates.lat.toFixed(4)}, 
                          Lng: {selectedTrip.coordinates.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTrip(null)}>
                Close
              </Button>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Driver
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}