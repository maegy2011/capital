'use client'

import { useState } from 'react'
import MobileSupervisorLayout from '@/components/supervisor/MobileSupervisorLayout'
import MobileCard, { MobileTripCard, MobileAlertCard, MobileBusCard } from '@/components/supervisor/MobileCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  AlertTriangle, 
  Clock, 
  Bus, 
  Users, 
  MapPin,
  CheckCircle,
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Navigation,
  Bell,
  Search,
  Filter
} from 'lucide-react'

// Mock data
const mockTrips = [
  {
    id: '1',
    route: 'Tahrir → Admin Capital',
    bus: 'CA 1234',
    driver: 'Ahmed Hassan',
    status: 'delayed',
    passengers: 18,
    progress: 65,
    currentLocation: 'Nasr City',
    nextStop: 'Heliopolis'
  },
  {
    id: '2',
    route: 'Nasr City → Admin Capital',
    bus: 'CA 5678',
    driver: 'Mohamed Ali',
    status: 'on-time',
    passengers: 25,
    progress: 40,
    currentLocation: 'Heliopolis',
    nextStop: 'Admin Capital'
  }
]

const mockAlerts = [
  {
    id: '1',
    title: 'Bus CA 5678 Delayed',
    bus: 'CA 5678',
    severity: 'medium',
    description: 'Bus running 15 minutes behind schedule',
    location: 'Nasr City',
    time: '5 min ago',
    resolved: false
  },
  {
    id: '2',
    title: 'Maintenance Required',
    bus: 'CA 9012',
    severity: 'high',
    description: 'Engine performance degrading',
    location: 'Heliopolis',
    time: '1 hour ago',
    resolved: false
  }
]

const mockBuses = [
  {
    id: '1',
    plateNumber: 'CA 1234',
    type: 'STANDARD',
    capacity: 35,
    isActive: true,
    currentLocation: { lat: 30.0744, lng: 31.3787 }
  },
  {
    id: '2',
    plateNumber: 'CA 5678',
    type: 'DELUXE',
    capacity: 40,
    isActive: true,
    currentLocation: { lat: 30.0458, lng: 31.3245 }
  }
]

export default function MobileSupervisorPage() {
  const [activeTab, setActiveTab] = useState('trips')
  const [searchQuery, setSearchQuery] = useState('')

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'trips': return 'Trip Management'
      case 'buses': return 'Bus Fleet'
      case 'realtime': return 'Real-time Tracking'
      case 'trip-tracking': return 'Trip Tracking'
      case 'delays': return 'Delay Management'
      case 'notifications': return 'Alert Management'
      case 'analytics': return 'Analytics'
      case 'stations': return 'Stations'
      default: return 'Supervisor Dashboard'
    }
  }

  const handleViewTripDetails = (tripId: string) => {
    console.log('View trip details:', tripId)
  }

  const handleContactDriver = (tripId: string) => {
    console.log('Contact driver for trip:', tripId)
  }

  const handleViewAlertDetails = (alertId: string) => {
    console.log('View alert details:', alertId)
  }

  const handleResolveAlert = (alertId: string) => {
    console.log('Resolve alert:', alertId)
  }

  const handleViewBusDetails = (busId: string) => {
    console.log('View bus details:', busId)
  }

  const handleEditBus = (busId: string) => {
    console.log('Edit bus:', busId)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'trips':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Trips</h2>
              <Button size="sm" className="bg-blue-600">
                <Plus className="h-4 w-4 mr-1" />
                New Trip
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockTrips.map((trip) => (
                <MobileTripCard
                  key={trip.id}
                  trip={trip}
                  onViewDetails={() => handleViewTripDetails(trip.id)}
                  onContact={() => handleContactDriver(trip.id)}
                />
              ))}
            </div>
          </div>
        )

      case 'buses':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Bus Fleet</h2>
              <Button size="sm" className="bg-purple-600">
                <Plus className="h-4 w-4 mr-1" />
                Add Bus
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockBuses.map((bus) => (
                <MobileBusCard
                  key={bus.id}
                  bus={bus}
                  onViewDetails={() => handleViewBusDetails(bus.id)}
                  onEdit={() => handleEditBus(bus.id)}
                />
              ))}
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Alerts</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-800">3 Urgent</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <MobileAlertCard
                  key={alert.id}
                  alert={alert}
                  onViewDetails={() => handleViewAlertDetails(alert.id)}
                  onResolve={() => handleResolveAlert(alert.id)}
                />
              ))}
            </div>
          </div>
        )

      case 'realtime':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Real-time Tracking</h2>
            
            <div className="space-y-4">
              <MobileCard
                title="System Status"
                status="Connected"
                statusColor="bg-green-100 text-green-800"
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-xs text-gray-600">Active Buses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-xs text-gray-600">On Time</div>
                  </div>
                </div>
              </MobileCard>

              <MobileCard
                title="Live Bus Locations"
                subtitle="Real-time GPS tracking"
              >
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Map view</p>
                  </div>
                </div>
              </MobileCard>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
            
            <div className="space-y-4">
              <MobileCard
                title="On-Time Performance"
                progress={84}
                progressLabel="Current Score"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">↑ 3% vs last week</span>
                  <Badge className="bg-green-100 text-green-800">Good</Badge>
                </div>
              </MobileCard>

              <MobileCard
                title="Passenger Satisfaction"
                progress={92}
                progressLabel="Rating"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-600">4.6/5.0 average</span>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </MobileCard>

              <MobileCard
                title="Alert Resolution"
                progress={87}
                progressLabel="Resolution Rate"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">18 min avg time</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
                </div>
              </MobileCard>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600">Select a tab to view content</p>
          </div>
        )
    }
  }

  return (
    <MobileSupervisorLayout
      title={getTabTitle(activeTab)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </MobileSupervisorLayout>
  )
}