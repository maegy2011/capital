"use client"

import { useState, useEffect, useCallback } from 'react'
import { ReactNode } from 'react'
import { PageContainer, UserRole } from '@/components/ui/mobile-navigation'
import { MobileCard, MobileButton, MobileList, MobileListItem } from '@/components/ui/mobile-layout'
import { 
  SwipeGesture, 
  PullToRefresh, 
  OfflineSupport, 
  InfiniteScroll, 
  TouchFeedback,
  OptimizedImage,
  useDebounce,
  useNetworkStatus,
  useLazyLoad
} from '@/components/ui/mobile-optimization'
import { 
  MapPin, 
  Clock, 
  Navigation, 
  Bus, 
  Users, 
  Star,
  Search,
  Ticket,
  Wallet,
  Bell,
  QrCode,
  Filter,
  ArrowRight,
  Heart,
  Share2,
  Download,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react'

interface Station {
  id: string
  name: string
  description: string
  distance: string
  nextArrival: string
  fare: number
  rating: number
  availableSeats: number
  image?: string
  isFavorite?: boolean
}

const mockStations: Station[] = [
  {
    id: '1',
    name: 'Tahrir Square Station',
    description: 'Central Cairo hub',
    distance: '2.3 km',
    nextArrival: '15 min',
    fare: 25,
    rating: 4.8,
    availableSeats: 12,
    image: '/stations/tahrir.jpg',
    isFavorite: true
  },
  {
    id: '2',
    name: 'Nasr City Station',
    description: 'Eastern Cairo location',
    distance: '4.1 km',
    nextArrival: '25 min',
    fare: 35,
    rating: 4.6,
    availableSeats: 8,
    image: '/stations/nasr.jpg'
  },
  {
    id: '3',
    name: 'Maadi Station',
    description: 'Southern Cairo station',
    distance: '6.8 km',
    nextArrival: '35 min',
    fare: 45,
    rating: 4.7,
    availableSeats: 15,
    image: '/stations/maadi.jpg'
  },
  {
    id: '4',
    name: 'Heliopolis Station',
    description: 'Northeastern Cairo hub',
    distance: '3.7 km',
    nextArrival: '20 min',
    fare: 30,
    rating: 4.9,
    availableSeats: 6,
    image: '/stations/heliopolis.jpg'
  }
]

interface RecentTrip {
  id: string
  from: string
  to: string
  date: string
  time: string
  fare: number
  status: 'completed' | 'cancelled' | 'upcoming'
  busPlate?: string
}

const mockRecentTrips: RecentTrip[] = [
  {
    id: '1',
    from: 'Tahrir Square',
    to: 'Administrative Capital',
    date: 'Today',
    time: '08:30 AM',
    fare: 50,
    status: 'completed',
    busPlate: 'CA 1234'
  },
  {
    id: '2',
    from: 'Nasr City',
    to: 'Administrative Capital',
    date: 'Yesterday',
    time: '07:45 AM',
    fare: 50,
    status: 'completed',
    busPlate: 'CA 5678'
  }
]

export default function MobilePassengerInterface() {
  const [userRole, setUserRole] = useState<UserRole>('passenger')
  const [searchQuery, setSearchQuery] = useState('')
  const [stations, setStations] = useState<Station[]>(mockStations)
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>(mockRecentTrips)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  
  const { isOnline, effectiveType } = useNetworkStatus()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Simulate loading more stations
  const loadMoreStations = useCallback(async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add more mock stations
    const newStations: Station[] = [
      {
        id: `${stations.length + 1}`,
        name: `Station ${stations.length + 1}`,
        description: 'Additional station',
        distance: `${Math.floor(Math.random() * 10) + 1} km`,
        nextArrival: `${Math.floor(Math.random() * 30) + 10} min`,
        fare: Math.floor(Math.random() * 30) + 20,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        availableSeats: Math.floor(Math.random() * 20) + 5
      }
    ]
    
    setStations(prev => [...prev, ...newStations])
    setHasMore(stations.length < 10) // Stop after 10 stations
    setIsLoading(false)
  }, [isLoading, hasMore, stations.length])

  // Filter stations based on search
  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }, [])

  const handleBookTrip = (station: Station) => {
    setSelectedStation(station)
    // In a real app, this would navigate to booking page
    console.log('Booking trip to:', station.name)
  }

  const toggleFavorite = (stationId: string) => {
    setStations(prev => prev.map(station =>
      station.id === stationId 
        ? { ...station, isFavorite: !station.isFavorite }
        : station
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'upcoming': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const OfflineFallback = () => (
    <MobileCard>
      <div className="text-center py-8">
        <WifiOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">You're Offline</h3>
        <p className="text-gray-600 mb-4">Check your internet connection to continue booking trips.</p>
        <MobileButton variant="outline" onClick={() => window.location.reload()}>
          <Wifi className="h-4 w-4 mr-2" />
          Retry Connection
        </MobileButton>
      </div>
    </MobileCard>
  )

  return (
    <OfflineSupport fallback={<OfflineFallback />}>
      <PageContainer 
        currentRole={userRole}
        onRoleChange={setUserRole}
        title="Welcome back!"
        subtitle="Where would you like to go today?"
        actions={
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            {effectiveType && (
              <span className="text-xs text-gray-500">
                {effectiveType}
              </span>
            )}
          </div>
        }
      >
        <PullToRefresh onRefresh={handleRefresh} isRefreshing={isLoading}>
          {/* Network Status Bar */}
          <MobileCard padding="sm" className="mb-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Signal className="h-3 w-3" />
                <span>Network: {effectiveType || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery className="h-3 w-3" />
                <span>Optimized for mobile</span>
              </div>
            </div>
          </MobileCard>

          {/* Quick Actions */}
          <MobileCard>
            <div className="grid grid-cols-4 gap-3">
              <TouchFeedback>
                <MobileButton variant="ghost" className="flex-col p-3 h-auto">
                  <QrCode className="h-6 w-6 mb-1" />
                  <span className="text-xs">Scan</span>
                </MobileButton>
              </TouchFeedback>
              <TouchFeedback>
                <MobileButton variant="ghost" className="flex-col p-3 h-auto">
                  <Ticket className="h-6 w-6 mb-1" />
                  <span className="text-xs">Tickets</span>
                </MobileButton>
              </TouchFeedback>
              <TouchFeedback>
                <MobileButton variant="ghost" className="flex-col p-3 h-auto">
                  <Wallet className="h-6 w-6 mb-1" />
                  <span className="text-xs">Wallet</span>
                </MobileButton>
              </TouchFeedback>
              <TouchFeedback>
                <MobileButton variant="ghost" className="flex-col p-3 h-auto">
                  <Bell className="h-6 w-6 mb-1" />
                  <span className="text-xs">Alerts</span>
                </MobileButton>
              </TouchFeedback>
            </div>
          </MobileCard>

          {/* Search */}
          <MobileCard padding="sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search stations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </MobileCard>

          {/* Featured Route */}
          <SwipeGesture onSwipeLeft={() => console.log('Swiped left on featured route')}>
            <MobileCard>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Featured Route</h3>
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tahrir Square → Admin Capital</span>
                    <span className="font-semibold">EGP 50</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-blue-100">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      45 min
                    </span>
                    <span className="flex items-center">
                      <Bus className="h-3 w-3 mr-1" />
                      Express
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      15 seats
                    </span>
                  </div>
                  <TouchFeedback>
                    <MobileButton 
                      variant="secondary" 
                      className="w-full mt-3 bg-white text-blue-600 hover:bg-gray-50"
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </MobileButton>
                  </TouchFeedback>
                </div>
              </div>
            </MobileCard>
          </SwipeGesture>

          {/* Nearby Stations */}
          <InfiniteScroll
            onLoadMore={loadMoreStations}
            hasMore={hasMore}
            isLoading={isLoading}
          >
            <MobileCard title="Nearby Stations">
              <MobileList>
                {filteredStations.map((station) => (
                  <SwipeGesture 
                    key={station.id}
                    onSwipeLeft={() => toggleFavorite(station.id)}
                  >
                    <TouchFeedback>
                      <MobileListItem
                        onClick={() => handleBookTrip(station)}
                        leading={
                          <div className="relative">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            {station.isFavorite && (
                              <Heart className="absolute -top-1 -right-1 h-4 w-4 text-red-500 fill-current" />
                            )}
                          </div>
                        }
                        trailing={
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              EGP {station.fare}
                            </div>
                            <div className="text-xs text-gray-500">
                              {station.distance}
                            </div>
                          </div>
                        }
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{station.name}</h4>
                            <div className="flex items-center space-x-1">
                              <div className="flex items-center text-xs text-yellow-600">
                                <Star className="h-3 w-3 fill-current mr-0.5" />
                                {station.rating}
                              </div>
                              <TouchFeedback>
                                <Heart 
                                  className={`h-4 w-4 ${station.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(station.id)
                                  }}
                                />
                              </TouchFeedback>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{station.description}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {station.nextArrival}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {station.availableSeats} seats
                            </span>
                          </div>
                        </div>
                      </MobileListItem>
                    </TouchFeedback>
                  </SwipeGesture>
                ))}
              </MobileList>
            </MobileCard>
          </InfiniteScroll>

          {/* Recent Trips */}
          <MobileCard title="Recent Trips">
            <MobileList>
              {recentTrips.map((trip) => (
                <TouchFeedback key={trip.id}>
                  <MobileListItem
                    leading={
                      <div className={`p-2 rounded-lg ${
                        trip.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Bus className={`h-4 w-4 ${
                          trip.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                    }
                    trailing={
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          EGP {trip.fare}
                        </div>
                        <div className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </div>
                      </div>
                    }
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{trip.from} → {trip.to}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-sm text-gray-500">{trip.date}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{trip.time}</span>
                        {trip.busPlate && (
                          <>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{trip.busPlate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </MobileListItem>
                </TouchFeedback>
              ))}
            </MobileList>
          </MobileCard>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            <TouchFeedback>
              <MobileCard padding="sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Wallet className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wallet Balance</p>
                    <p className="font-semibold text-gray-900">EGP 250</p>
                  </div>
                </div>
              </MobileCard>
            </TouchFeedback>
            
            <TouchFeedback>
              <MobileCard padding="sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Ticket className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Tickets</p>
                    <p className="font-semibold text-gray-900">3</p>
                  </div>
                </div>
              </MobileCard>
            </TouchFeedback>
          </div>

          {/* Performance Tips */}
          <MobileCard title="Performance Tips" padding="sm">
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Swipe left on stations to add to favorites</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Pull down to refresh station data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Images are optimized for your connection</span>
              </div>
            </div>
          </MobileCard>
        </PullToRefresh>
      </PageContainer>
    </OfflineSupport>
  )
}