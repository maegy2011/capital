"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  CreditCard,
  TrendingUp,
  Shield,
  ArrowRight,
  Home,
  User,
  Settings,
  LogOut,
  ArrowRight as ArrowRightIcon
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'
import Link from 'next/link'
import StationCard from '@/components/passenger/StationCard'
import WalletCard from '@/components/passenger/WalletCard'
import TripCard from '@/components/passenger/TripCard'
import BookingModal from '@/components/passenger/BookingModal'

interface Station {
  id: string
  name: string
  address?: string
  latitude: number
  longitude: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  tripStations?: Array<{
    trip: {
      bus: {
        plateNumber: string
        type: string
        capacity: number
      }
    }
  }>
  bookings?: Array<{
    user: {
      name: string
    }
  }>
}

interface Trip {
  id: string
  busId: string
  departureTime: string
  arrivalTime: string
  status: string
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  bus: {
    id: string
    plateNumber: string
    type: string
    capacity: number
    photoUrl?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  tripStations: Array<{
    station: Station
    stopOrder: number
    arrivalTime: string
    departureTime: string
  }>
}

interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: string
  userId: string
  tripId: string
  stationId: string
  seatNumber?: number
  status: string
  qrCode?: string
  totalPrice: number
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}

export default function PassengerDashboard() {
  const { t, isRTL } = useLanguage()
  const [stations, setStations] = useState<Station[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, bookingsRes, tripsRes] = await Promise.all([
          fetch('/api/stations'),
          fetch('/api/bookings'),
          fetch('/api/trips?status=SCHEDULED')
        ])

        const stationsData = await stationsRes.json()
        const bookingsData = await bookingsRes.json()
        const tripsData = await tripsRes.json()

        setStations(stationsData)
        setBookings(bookingsData)
        setTrips(tripsData)

        // Mock wallet data - in real app, this would come from user context or API
        setWallet({
          id: '1',
          userId: '1',
          balance: 250,
          currency: 'EGP',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchFilteredStations = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await fetch(`/api/stations?search=${encodeURIComponent(searchQuery)}`)
          const data = await response.json()
          setStations(data)
        } catch (error) {
          console.error('Error searching stations:', error)
        }
      } else {
        // Fetch all stations if search is empty
        try {
          const response = await fetch('/api/stations')
          const data = await response.json()
          setStations(data)
        } catch (error) {
          console.error('Error fetching stations:', error)
        }
      }
    }

    const debounceTimer = setTimeout(fetchFilteredStations, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleBookTrip = (station: Station) => {
    setSelectedStation(station)
    // In a real app, this would navigate to booking page or show available trips
    console.log('Booking trip to:', station.name)
  }

  const handleBookTripFromCard = (trip: Trip) => {
    setSelectedTrip(trip)
    if (selectedStation) {
      setShowBookingModal(true)
    } else {
      // Find the first station for this trip
      const firstStation = trip.tripStations[0]?.station
      if (firstStation) {
        setSelectedStation(firstStation)
        setShowBookingModal(true)
      }
    }
  }

  const handleViewTrips = (station: Station) => {
    setSelectedStation(station)
    // Filter trips that include this station
    const stationTrips = trips.filter(trip => 
      trip.tripStations.some(ts => ts.station.id === station.id)
    )
    console.log('Trips for station:', station.name, stationTrips)
  }

  const activeBookings = bookings.filter(booking => 
    ['PENDING', 'CONFIRMED'].includes(booking.status)
  )

  const handleAddFunds = () => {
    // In a real app, this would navigate to wallet management
    console.log('Add funds to wallet')
  }

  const handleViewTransactions = () => {
    // In a real app, this would navigate to transaction history
    console.log('View transactions')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('passenger')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcome') || 'Welcome back!'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('whereToGo') || 'Where would you like to go today?'}
          </p>
        </div>

        {/* Quick Access Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/passenger/ticket-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('ticketManagement') || 'Ticket Management'}</h3>
                    <p className="text-sm text-gray-500">{t('viewAndManageTickets') || 'View and manage your tickets'}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/passenger/wallet-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('walletManagement') || 'Wallet Management'}</h3>
                    <p className="text-sm text-gray-500">{t('manageFundsAndTransactions') || 'Manage funds and transactions'}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/passenger/trip-history">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Navigation className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t('tripHistory') || 'Trip History'}</h3>
                    <p className="text-sm text-gray-500">{t('viewPastTripsAndDetails') || 'View past trips and details'}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('scan') || 'Scan'}</h3>
              <p className="text-sm text-gray-500">{t('scanTicket') || 'Scan ticket'}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Ticket className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('tickets') || 'Tickets'}</h3>
              <p className="text-sm text-gray-500">{t('myTickets') || 'My tickets'}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('wallet')}</h3>
              <p className="text-sm text-gray-500">{t('addFunds') || 'Add funds'}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-3">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('alerts') || 'Alerts'}</h3>
              <p className="text-sm text-gray-500">{t('notifications') || 'Notifications'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t('searchStations') || 'Search stations...'}
                className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Route */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{t('featuredRoute') || 'Featured Route'}</h3>
                <p className="text-blue-100">{t('popularRoute') || 'Most popular route'}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-300 fill-current" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg">Tahrir Square → Admin Capital</span>
                <span className="text-2xl font-bold">EGP 50</span>
              </div>
              <div className="flex items-center space-x-6 text-blue-100">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  45 min
                </span>
                <span className="flex items-center">
                  <Bus className="h-4 w-4 mr-2" />
                  {t('express') || 'Express'}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  15 {t('seats') || 'seats'}
                </span>
              </div>
              <Button 
                className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3"
              >
                {t('bookNow') || 'Book Now'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nearby Stations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                {t('nearbyStations') || 'Nearby Stations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-20 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : stations.length > 0 ? (
                <div className="space-y-4">
                  {stations.map((station) => (
                    <StationCard 
                      key={station.id}
                      station={station}
                      onViewTrips={handleViewTrips}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('noStationsFound') || 'No stations found'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-green-600" />
                {t('walletBalance') || 'Wallet Balance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wallet ? (
                <WalletCard 
                  wallet={wallet}
                  onAddFunds={handleAddFunds}
                  onViewTransactions={handleViewTransactions}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('loading') || 'Loading...'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Trips Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bus className="h-5 w-5 mr-2 text-blue-600" />
                {t('availableTrips') || 'Available Trips'}
              </CardTitle>
              <CardDescription>
                {t('scheduledTripsForToday') || 'Scheduled trips for today'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => (
                    <TripCard 
                      key={trip.id}
                      trip={trip}
                      onBookTrip={handleBookTripFromCard}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('noTripsAvailable') || 'No trips available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        station={selectedStation}
        trip={selectedTrip}
      />
    </div>
  )
}