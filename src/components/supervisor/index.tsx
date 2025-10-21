"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bus, Plus } from 'lucide-react'
import BusRegistration, { BusData } from '../bus-registration'
import NotificationSystem from '../notification-system'
import StatsCards from './StatsCards'
import TripManagement from './TripManagement'
import BusFleet from './BusFleet'
import RealTimeTracking from './RealTimeTracking'
import AlertManagement from './AlertManagement'
import DelayManagement from './DelayManagement'
import TripTracking from './TripTracking'
import Analytics from './Analytics'

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

  const [showBusRegistrationDialog, setShowBusRegistrationDialog] = useState<Bus | null>(null)

  const stats = {
    totalTrips: trips.length,
    activeTrips: trips.filter(t => t.status === 'in_progress').length,
    totalPassengers: trips.reduce((acc, trip) => acc + trip.passengerCount, 0),
    totalRevenue: trips.reduce((acc, trip) => acc + trip.revenue, 0),
    avgOccupancy: trips.length > 0 ? 
      Math.round(trips.reduce((acc, trip) => acc + (trip.passengerCount / trip.capacity), 0) / trips.length * 100) : 0
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

  const handleCreateTrip = (busId: string, departureTime: string) => {
    const selectedBus = buses.find(b => b.id === busId)
    if (!selectedBus) return

    const trip: Trip = {
      id: Date.now().toString(),
      busId: busId,
      busPlate: selectedBus.plateNumber,
      departureTime: departureTime,
      arrivalTime: '', // Will be calculated
      status: 'scheduled',
      passengerCount: 0,
      capacity: selectedBus.capacity,
      revenue: 0,
      route: ['Tahrir Square', 'Nasr City', 'Administrative Capital'] // Default route
    }

    setTrips(prev => [trip, ...prev])
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
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="trips">Trip Management</TabsTrigger>
          <TabsTrigger value="buses">Bus Fleet</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Tracking</TabsTrigger>
          <TabsTrigger value="trip-tracking">Trip Tracking</TabsTrigger>
          <TabsTrigger value="delays">Delay Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="space-y-6">
          <TripManagement 
            trips={trips}
            buses={buses}
            onTripAction={handleTripAction}
            onCreateTrip={handleCreateTrip}
          />
        </TabsContent>

        <TabsContent value="buses" className="space-y-6">
          <BusFleet 
            buses={buses}
            onBusEdit={(bus) => setShowBusRegistrationDialog(bus)}
            onBusSave={handleBusSave}
          />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeTracking />
        </TabsContent>

        <TabsContent value="trip-tracking" className="space-y-6">
          <TripTracking />
        </TabsContent>

        <TabsContent value="delays" className="space-y-6">
          <DelayManagement />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <AlertManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Analytics />
        </TabsContent>

        <TabsContent value="stations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bus Stations</CardTitle>
              <CardDescription>
                Manage all bus stations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stations.map((station) => (
                  <div key={station.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{station.name}</h3>
                    <p className="text-sm text-gray-600">{station.address}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        station.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bus Registration Dialog */}
      {showBusRegistrationDialog !== null && (
        <BusRegistration
          bus={showBusRegistrationDialog}
          onSave={handleBusSave}
          onCancel={() => setShowBusRegistrationDialog(null)}
        />
      )}
    </div>
  )
}