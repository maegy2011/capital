"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bus, Clock, MapPin, Navigation, Users, Wifi, WifiOff } from 'lucide-react'
import * as L from 'leaflet'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

interface BusLocation {
  lat: number
  lng: number
  timestamp: string
  speed: number
  heading: number
}

interface StationStop {
  id: string
  name: string
  lat: number
  lng: number
  arrivalTime: string
  departureTime: string
  status: 'upcoming' | 'arrived' | 'passed'
  order: number
}

interface LiveTrackingProps {
  tripId?: string
  busId?: string
}

export default function LiveTracking({ tripId = 'trip-1', busId = 'bus-1' }: LiveTrackingProps) {
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [routeProgress, setRouteProgress] = useState(0)
  const [nextStop, setNextStop] = useState<StationStop | null>(null)
  const [eta, setEta] = useState<string>('')
  const [passengers, setPassengers] = useState(0)
  const [stations, setStations] = useState<StationStop[]>([])
  const [map, setMap] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const handleMapReady = () => {
    // Map instance is available through other means if needed
  }

  // Sample stations data
  const sampleStations: StationStop[] = [
    {
      id: '1',
      name: 'Tahrir Square Station',
      lat: 30.0444,
      lng: 31.2357,
      arrivalTime: '08:00',
      departureTime: '08:05',
      status: 'passed',
      order: 1
    },
    {
      id: '2',
      name: 'Nasr City Station',
      lat: 30.0607,
      lng: 31.3287,
      arrivalTime: '08:20',
      departureTime: '08:25',
      status: 'passed',
      order: 2
    },
    {
      id: '3',
      name: 'Heliopolis Station',
      lat: 30.0889,
      lng: 31.3289,
      arrivalTime: '08:40',
      departureTime: '08:45',
      status: 'arrived',
      order: 3
    },
    {
      id: '4',
      name: 'Administrative Capital Station',
      lat: 30.0084,
      lng: 31.7417,
      arrivalTime: '09:15',
      departureTime: '09:20',
      status: 'upcoming',
      order: 4
    }
  ]

  useEffect(() => {
    setStations(sampleStations)
    
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      try {
        // In a real app, this would connect to your WebSocket server
        // For demo purposes, we'll simulate the connection
        setIsConnected(true)
        
        // Simulate receiving bus location updates
        const interval = setInterval(() => {
          if (isConnected) {
            simulateBusLocationUpdate()
          }
        }, 5000) // Update every 5 seconds

        return () => clearInterval(interval)
      } catch (error) {
        console.error('WebSocket connection failed:', error)
        setIsConnected(false)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [isConnected])

  const simulateBusLocationUpdate = () => {
    // Simulate bus moving along the route
    const currentStation = stations.find(s => s.status === 'arrived')
    const upcomingStation = stations.find(s => s.status === 'upcoming')
    
    if (currentStation && upcomingStation) {
      // Calculate intermediate position
      const progress = Math.random() * 0.3 + 0.1 // 10-40% progress to next station
      const lat = currentStation.lat + (upcomingStation.lat - currentStation.lat) * progress
      const lng = currentStation.lng + (upcomingStation.lng - currentStation.lng) * progress
      
      const newLocation: BusLocation = {
        lat,
        lng,
        timestamp: new Date().toISOString(),
        speed: Math.random() * 20 + 30, // 30-50 km/h
        heading: Math.random() * 360
      }
      
      setBusLocation(newLocation)
      setRouteProgress(progress * 100)
      setNextStop(upcomingStation)
      
      // Calculate ETA (simple simulation)
      const etaMinutes = Math.round((1 - progress) * 15) // 15 minutes to next stop
      setEta(`${etaMinutes} min`)
      
      // Update passenger count
      setPassengers(Math.floor(Math.random() * 20) + 15) // 15-35 passengers
    }
  }

  const getRouteCoordinates = (): LatLngExpression[] => {
    return stations.map(station => [station.lat, station.lng])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-gray-100 text-gray-800'
      case 'arrived': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✓'
      case 'arrived': return '●'
      case 'upcoming': return '○'
      default: return '○'
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Bus className="h-5 w-5 mr-2 text-blue-600" />
              Live Bus Tracking
            </span>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Badge variant="outline">
                Trip: {tripId}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time tracking of bus location and progress
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[30.0444, 31.2357]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                  whenReady={handleMapReady}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Station markers */}
                  {stations.map((station) => (
                    <Marker
                      key={station.id}
                      position={[station.lat, station.lng]}
                      icon={L.divIcon({
                        className: 'station-marker',
                        html: `<div style="background-color: ${station.status === 'arrived' ? '#10B981' : station.status === 'passed' ? '#6B7280' : '#3B82F6'}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                      })}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{station.name}</h3>
                          <p className="text-sm text-gray-600">
                            Arrival: {station.arrivalTime}
                          </p>
                          <p className="text-sm text-gray-600">
                            Departure: {station.departureTime}
                          </p>
                          <Badge className={`mt-2 ${getStatusColor(station.status)}`}>
                            {station.status}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Bus location marker */}
                  {busLocation && (
                    <Marker
                      position={[busLocation.lat, busLocation.lng]}
                      icon={L.divIcon({
                        className: 'bus-marker',
                        html: '<div style="background-color: #EF4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); animation: pulse 2s infinite;"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                      })}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">Bus Location</h3>
                          <p className="text-sm text-gray-600">
                            Speed: {busLocation.speed.toFixed(1)} km/h
                          </p>
                          <p className="text-sm text-gray-600">
                            Passengers: {passengers}
                          </p>
                          {eta && (
                            <p className="text-sm text-blue-600">
                              ETA: {eta}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Route polyline */}
                  <Polyline
                    positions={getRouteCoordinates()}
                    color="#3B82F6"
                    weight={4}
                    opacity={0.6}
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Information */}
        <div className="space-y-4">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextStop ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Stop:</span>
                    <span className="font-medium">{nextStop.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ETA:</span>
                    <span className="font-medium text-blue-600">{eta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <span className="font-medium">{routeProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={routeProgress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Passengers:</span>
                    <span className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {passengers}
                    </span>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Waiting for bus location data...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Station Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Station Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      station.status === 'arrived' ? 'bg-green-50' : 
                      station.status === 'passed' ? 'bg-gray-50' : 
                      'bg-blue-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      station.status === 'arrived' ? 'bg-green-600' : 
                      station.status === 'passed' ? 'bg-gray-400' : 
                      'bg-blue-600'
                    }`}>
                      {getStatusIcon(station.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{station.name}</h4>
                      <p className="text-xs text-gray-600">
                        {station.arrivalTime} - {station.departureTime}
                      </p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(station.status)}`}>
                      {station.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                View Full Route
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Details
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Navigation className="h-4 w-4 mr-2" />
              Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}