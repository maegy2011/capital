"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Bus, Edit, MapPin } from 'lucide-react'
import BusRegistration, { BusData } from '../bus-registration'

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

interface BusFleetProps {
  buses: Bus[]
  onBusEdit: (bus: Bus) => void
  onBusSave: (busData: BusData) => void
}

export default function BusFleet({ buses, onBusEdit, onBusSave }: BusFleetProps) {
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

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactive</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus Fleet</CardTitle>
        <CardDescription>
          Manage and monitor all buses in the fleet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((bus) => (
            <div key={bus.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{bus.plateNumber}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getBusTypeBadge(bus.type)}
                    {getStatusBadge(bus.isActive)}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBusEdit(bus)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              {bus.photoUrl && (
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={bus.photoUrl} 
                    alt={bus.plateNumber}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span>{bus.capacity} seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price/km:</span>
                  <span>EGP {bus.pricePerKm}</span>
                </div>
                {bus.currentLocation && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Location tracked</span>
                  </div>
                )}
                {bus.features.length > 0 && (
                  <div>
                    <span className="text-gray-600">Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bus.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {bus.features.length > 3 && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          +{bus.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}