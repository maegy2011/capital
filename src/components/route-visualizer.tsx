"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { LatLngExpression } from 'leaflet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, MapPin, Navigation, Route } from 'lucide-react'
import RouteService, { RoutePoint, TurnByTurnDirection } from '@/lib/route-service'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false })

interface RouteVisualizerProps {
  userLocation: LatLngExpression
  destination: {
    name: string
    lat: number
    lng: number
    description?: string
  }
  onRouteCalculated?: (routeData: any) => void
}

export default function RouteVisualizer({ 
  userLocation, 
  destination, 
  onRouteCalculated 
}: RouteVisualizerProps) {
  const [routeData, setRouteData] = useState<any>(null)
  const [directions, setDirections] = useState<TurnByTurnDirection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userLocation && destination) {
      calculateRoute()
    }
  }, [userLocation, destination])

  const calculateRoute = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const routeService = RouteService.getInstance()
      
      // Calculate route
      const route = await routeService.calculateRoute(
        { lat: userLocation[0], lng: userLocation[1] },
        { lat: destination.lat, lng: destination.lng }
      )
      
      // Get turn-by-turn directions
      const turnByTurn = await routeService.getTurnByTurnDirections(
        { lat: userLocation[0], lng: userLocation[1] },
        { lat: destination.lat, lng: destination.lng }
      )
      
      setRouteData(route)
      setDirections(turnByTurn)
      
      if (onRouteCalculated) {
        onRouteCalculated(route)
      }
    } catch (err) {
      console.error('Error calculating route:', err)
      setError('Failed to calculate route. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRouteCoordinates = (): LatLngExpression[] => {
    if (!routeData) return []
    
    return RouteService.convertToLeafletCoordinates(routeData.coordinates)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-blue-600" />
            Calculating Route
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Navigation className="h-5 w-5 mr-2" />
            Route Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={calculateRoute} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!routeData) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Route Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-green-600" />
            Route to {destination.name}
          </CardTitle>
          <CardDescription>
            Turn-by-turn directions to your boarding station
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="font-medium">
                {RouteService.formatDuration(routeData.duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Distance:</span>
              <span className="font-medium">
                {RouteService.formatDistance(routeData.distance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Turn-by-Turn Directions */}
      {directions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="h-5 w-5 mr-2 text-purple-600" />
              Directions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {directions.map((direction, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{direction.instruction}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{RouteService.formatDistance(direction.distance)}</span>
                      <span>{RouteService.formatDuration(direction.duration)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full rounded-lg overflow-hidden">
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* User location marker */}
              <Marker
                position={userLocation}
              >
                <Popup>Your Location</Popup>
              </Marker>

              {/* Destination marker */}
              <Marker
                position={[destination.lat, destination.lng]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{destination.name}</h3>
                    {destination.description && (
                      <p className="text-sm text-gray-600">{destination.description}</p>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Route polyline */}
              <Polyline
                positions={getRouteCoordinates()}
                color="#10B981"
                weight={4}
                dashArray="10, 10"
                opacity={0.8}
              />
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}