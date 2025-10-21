"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Settings,
  Timer
} from 'lucide-react'
import BusRegistration, { BusData } from './bus-registration'
import DelayManagement from './delay-management'
import NotificationSystem from './notification-system'

interface Trip {
  id: string
  busId: string
  busPlate: string
  departureTime: string
  arrivalTime: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  passengerCount: number
  capacity: number
  revenue: number
  route: string[]
}

interface Bus {
  id: string
  plateNumber: string
  type: 'STANDARD' | 'DELUXE' | 'VIP'
  capacity: number
  isActive: boolean
  currentLocation?: {
    lat: number
    lng: number
    timestamp: string
  }
  photoUrl?: string
  pricePerKm: number
  features: string[]
  description?: string
}

interface Station {
  id: string
  name: string
  address: string
  isActive: boolean
}

export default function SupervisorDashboard() {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      busId: 'bus-1',
      busPlate: 'CA 1234',
      departureTime: '08:00',
      arrivalTime: '09:30',
      status: 'in_progress',
      passengerCount: 28,
      capacity: 35,
      revenue: 1400,
      route: ['Tahrir Square', 'Nasr City', 'Heliopolis', 'Administrative Capital']
    },
    {
      id: '2',
      busId: 'bus-2',
      busPlate: 'CA 5678',
      departureTime: '09:00',
      arrivalTime: '10:30',
      status: 'scheduled',
      passengerCount: 0,
      capacity: 40,
      revenue: 0,
      route: ['Maadi', 'Nasr City', 'Administrative Capital']
    },
    {
      id: '3',
      busId: 'bus-3',
      busPlate: 'CA 9012',
      departureTime: '07:00',
      arrivalTime: '08:30',
      status: 'completed',
      passengerCount: 32,
      capacity: 35,
      revenue: 1600,
      route: ['Heliopolis', 'Administrative Capital']
    }
  ])

  const [buses, setBuses] = useState<Bus[]>([
    {
      id: 'bus-1',
      plateNumber: 'CA 1234',
      type: 'STANDARD',
      capacity: 35,
      isActive: true,
      currentLocation: {
        lat: 30.0744,
        lng: 31.3787,
        timestamp: new Date().toISOString()
      },
      photoUrl: 'https://images.unsplash.com/photo-1571575524565-71fa5fc98371?w=400',
      pricePerKm: 2.5,
      features: ['WiFi', 'USB Charging', 'Air Conditioning'],
      description: 'Standard bus with basic amenities'
    },
    {
      id: 'bus-2',
      plateNumber: 'CA 5678',
      type: 'DELUXE',
      capacity: 40,
      isActive: true,
      photoUrl: 'https://images.unsplash.com/photo-1568606293930-dc5f39ce7ea3?w=400',
      pricePerKm: 3.5,
      features: ['WiFi', 'USB Charging', 'Air Conditioning', 'Reclining Seats', 'TV Entertainment'],
      description: 'Deluxe bus with premium features'
    },
    {
      id: 'bus-3',
      plateNumber: 'CA 9012',
      type: 'VIP',
      capacity: 35,
      isActive: false,
      photoUrl: 'https://images.unsplash.com/photo-1588279419856-3cf8fed7e3a2?w=400',
      pricePerKm: 5.0,
      features: ['WiFi', 'USB Charging', 'Air Conditioning', 'Reclining Seats', 'TV Entertainment', 'GPS Tracking'],
      description: 'VIP luxury bus with all amenities'
    }
  ])

  const [stations] = useState<Station[]>([
    { id: '1', name: 'Tahrir Square', address: 'Central Cairo', isActive: true },
    { id: '2', name: 'Nasr City', address: 'Eastern Cairo', isActive: true },
    { id: '3', name: 'Maadi', address: 'Southern Cairo', isActive: true },
    { id: '4', name: 'Heliopolis', address: 'Northeastern Cairo', isActive: true },
    { id: '5', name: 'Administrative Capital', address: 'Final Destination', isActive: true }
  ])

  const [showCreateTripDialog, setShowCreateTripDialog] = useState(false)
  const [showBusRegistrationDialog, setShowBusRegistrationDialog] = useState<Bus | null>(null)
  const [newTrip, setNewTrip] = useState({
    busId: '',
    departureTime: '',
    price: 50
  })

  const stats = {
    totalTrips: trips.length,
    activeTrips: trips.filter(t => t.status === 'in_progress').length,
    totalPassengers: trips.reduce((acc, trip) => acc + trip.passengerCount, 0),
    totalRevenue: trips.reduce((acc, trip) => acc + trip.revenue, 0),
    avgOccupancy: trips.length > 0 ? 
      Math.round(trips.reduce((acc, trip) => acc + (trip.passengerCount / trip.capacity), 0) / trips.length * 100) : 0
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'in_progress':
        return <Badge className="bg-green-100 text-green-800">In Progress</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getBusTypeBadge = (type: string) => {
    switch (type) {
      case 'STANDARD':
        return <Badge variant="outline">Standard</Badge>
      case 'DELUXE':
        return <Badge className="bg-purple-100 text-purple-800">Deluxe</Badge>
      case 'VIP':
        return <Badge className="bg-yellow-100 text-yellow-800">VIP</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleCreateTrip = () => {
    if (!newTrip.busId || !newTrip.departureTime) return

    const selectedBus = buses.find(b => b.id === newTrip.busId)
    if (!selectedBus) return

    const trip: Trip = {
      id: Date.now().toString(),
      busId: newTrip.busId,
      busPlate: selectedBus.plateNumber,
      departureTime: newTrip.departureTime,
      arrivalTime: '', // Will be calculated
      status: 'scheduled',
      passengerCount: 0,
      capacity: selectedBus.capacity,
      revenue: 0,
      route: ['Tahrir Square', 'Nasr City', 'Administrative Capital'] // Default route
    }

    setTrips(prev => [trip, ...prev])
    setNewTrip({ busId: '', departureTime: '', price: 50 })
    setShowCreateTripDialog(false)
  }

  const handleTripAction = (tripId: string, action: 'start' | 'pause' | 'cancel') => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        switch (action) {
          case 'start':
            return { ...trip, status: 'in_progress' }
          case 'pause':
            return { ...trip, status: 'scheduled' }
          case 'cancel':
            return { ...trip, status: 'cancelled' }
          default:
            return trip
        }
      }
      return trip
    }))
  }

  const handleBusSave = (busData: BusData) => {
    if (busData.id) {
      // Update existing bus
      setBuses(prev => prev.map(bus => bus.id === busData.id ? { ...busData, id: busData.id } as Bus : bus))
    } else {
      // Add new bus
      const newBus: Bus = {
        ...busData,
        id: Date.now().toString()
      }
      setBuses(prev => [...prev, newBus])
    }
    setShowBusRegistrationDialog(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-600">Manage trips, buses, and monitor operations</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowBusRegistrationDialog(null)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Bus className="h-4 w-4 mr-2" />
            Register Bus
          </Button>
          <Button 
            onClick={() => setShowCreateTripDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Trip
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold">{stats.totalTrips}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.activeTrips}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold">{stats.totalPassengers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">EGP {stats.totalRevenue}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
                <p className="text-2xl font-bold">{stats.avgOccupancy}%</p>
              </div>
              <div className="relative">
                <Progress value={stats.avgOccupancy} className="h-2 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trips">Trip Management</TabsTrigger>
          <TabsTrigger value="buses">Bus Fleet</TabsTrigger>
          <TabsTrigger value="delays">Delay Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Trips</CardTitle>
              <CardDescription>
                Monitor and manage all trips in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">Trip {trip.id}</h3>
                          {getStatusBadge(trip.status)}
                        </div>
                        <p className="text-sm text-gray-600">Bus: {trip.busPlate}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {trip.departureTime}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {trip.passengerCount}/{trip.capacity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">EGP {trip.revenue}</div>
                        <div className="text-sm text-gray-500">{getBusTypeBadge(buses.find(b => b.id === trip.busId)?.type || 'STANDARD')}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {trip.route.slice(0, 3).map((stop, index) => (
                            <div key={index} className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                          ))}
                          {trip.route.length > 3 && (
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                              +{trip.route.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          {trip.route.join(' → ')}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {trip.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => handleTripAction(trip.id, 'start')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {trip.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTripAction(trip.id, 'pause')}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTripAction(trip.id, 'cancel')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {trip.passengerCount > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Occupancy</span>
                          <span>{Math.round((trip.passengerCount / trip.capacity) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(trip.passengerCount / trip.capacity) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bus Fleet</CardTitle>
              <CardDescription>
                Manage your bus fleet and track their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buses.map((bus) => (
                  <div key={bus.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        {bus.photoUrl ? (
                          <img 
                            src={bus.photoUrl} 
                            alt={bus.plateNumber}
                            className="w-12 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Bus className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{bus.plateNumber}</h3>
                          {getBusTypeBadge(bus.type)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge className={bus.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {bus.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span>{bus.capacity} seats</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price/km:</span>
                        <span>EGP {bus.pricePerKm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Trip:</span>
                        <span>{trips.find(t => t.busId === bus.id && t.status === 'in_progress') ? 'Active' : 'Idle'}</span>
                      </div>
                    </div>
                    
                    {bus.features.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-600 mb-1">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {bus.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {bus.features.length > 3 && (
                            <span className="text-xs text-gray-500">+{bus.features.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {bus.currentLocation && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center text-blue-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          Location Updated
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowBusRegistrationDialog(bus)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={bus.isActive ? "outline" : "default"}
                        onClick={() => {
                          setBuses(prev => prev.map(b => 
                            b.id === bus.id ? { ...b, isActive: !b.isActive } : b
                          ))
                        }}
                      >
                        {bus.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delays" className="space-y-6">
          <DelayManagement />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSystem />
        </TabsContent>

        <TabsContent value="stations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Station Management</CardTitle>
              <CardDescription>
                Manage boarding stations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stations.map((station) => (
                  <div key={station.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{station.name}</h3>
                        <p className="text-sm text-gray-600">{station.address}</p>
                      </div>
                      <Badge className={station.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {station.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Active trips: {trips.filter(t => t.status === 'in_progress').length}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Trip Dialog */}
      <Dialog open={showCreateTripDialog} onOpenChange={setShowCreateTripDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>
              Schedule a new trip for the selected bus
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bus-select">Select Bus</Label>
              <Select value={newTrip.busId} onValueChange={(value) => setNewTrip(prev => ({ ...prev, busId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a bus" />
                </SelectTrigger>
                <SelectContent>
                  {buses.filter(b => b.isActive).map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.plateNumber} - {bus.type} ({bus.capacity} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="departure-time">Departure Time</Label>
              <Input
                id="departure-time"
                type="time"
                value={newTrip.departureTime}
                onChange={(e) => setNewTrip(prev => ({ ...prev, departureTime: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="price">Ticket Price (EGP)</Label>
              <Input
                id="price"
                type="number"
                value={newTrip.price}
                onChange={(e) => setNewTrip(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTripDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrip}>
              Create Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bus Registration Dialog */}
      <Dialog open={!!showBusRegistrationDialog} onOpenChange={() => setShowBusRegistrationDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <BusRegistration
            bus={showBusRegistrationDialog || undefined}
            onSave={handleBusSave}
            onCancel={() => setShowBusRegistrationDialog(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}