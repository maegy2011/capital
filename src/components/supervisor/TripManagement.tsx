"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bus, Clock, Users, Play, Pause, Trash2, Plus } from 'lucide-react'

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
}

interface TripManagementProps {
  trips: Trip[]
  buses: Bus[]
  onTripAction: (tripId: string, action: 'start' | 'pause' | 'cancel') => void
  onCreateTrip: (busId: string, departureTime: string) => void
}

export default function TripManagement({ trips, buses, onTripAction, onCreateTrip }: TripManagementProps) {
  const [showCreateTripDialog, setShowCreateTripDialog] = useState(false)
  const [newTrip, setNewTrip] = useState({
    busId: '',
    departureTime: '',
    price: 50
  })

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
    onCreateTrip(newTrip.busId, newTrip.departureTime)
    setNewTrip({ busId: '', departureTime: '', price: 50 })
    setShowCreateTripDialog(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>
              Monitor and manage all trips in real-time
            </CardDescription>
          </div>
          <Dialog open={showCreateTripDialog} onOpenChange={setShowCreateTripDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogDescription>
                  Set up a new trip with the selected bus and departure time.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bus">Select Bus</Label>
                  <Select value={newTrip.busId} onValueChange={(value) => setNewTrip(prev => ({ ...prev, busId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a bus" />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.plateNumber} ({bus.type}) - {bus.capacity} seats
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="departure">Departure Time</Label>
                  <Input
                    id="departure"
                    type="time"
                    value={newTrip.departureTime}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, departureTime: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateTripDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTrip} disabled={!newTrip.busId || !newTrip.departureTime}>
                  Create Trip
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                      onClick={() => onTripAction(trip.id, 'start')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {trip.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTripAction(trip.id, 'pause')}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTripAction(trip.id, 'cancel')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}