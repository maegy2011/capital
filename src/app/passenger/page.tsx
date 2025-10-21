"use client"

import { useState } from 'react'
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

interface Station {
  id: string
  name: string
  description: string
  distance: string
  nextArrival: string
  fare: number
  rating: number
  availableSeats: number
}

const stations: Station[] = [
  {
    id: '1',
    name: 'Tahrir Square Station',
    description: 'Central Cairo hub',
    distance: '2.3 km',
    nextArrival: '15 min',
    fare: 25,
    rating: 4.8,
    availableSeats: 12
  },
  {
    id: '2',
    name: 'Nasr City Station',
    description: 'Eastern Cairo location',
    distance: '4.1 km',
    nextArrival: '25 min',
    fare: 35,
    rating: 4.6,
    availableSeats: 8
  },
  {
    id: '3',
    name: 'Maadi Station',
    description: 'Southern Cairo station',
    distance: '6.8 km',
    nextArrival: '35 min',
    fare: 45,
    rating: 4.7,
    availableSeats: 15
  },
  {
    id: '4',
    name: 'Heliopolis Station',
    description: 'Northeastern Cairo hub',
    distance: '3.7 km',
    nextArrival: '20 min',
    fare: 30,
    rating: 4.9,
    availableSeats: 6
  }
]

export default function PassengerDashboard() {
  const { t, isRTL } = useLanguage()
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookTrip = (station: Station) => {
    setSelectedStation(station)
    // In a real app, this would navigate to booking page
    console.log('Booking trip to:', station.name)
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
              <div className="space-y-4">
                {filteredStations.map((station) => (
                  <div 
                    key={station.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleBookTrip(station)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{station.name}</h4>
                          <div className="flex items-center text-sm text-yellow-600">
                            <Star className="h-3 w-3 fill-current mr-0.5" />
                            {station.rating}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{station.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {station.nextArrival}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {station.availableSeats} {t('seats') || 'seats'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        EGP {station.fare}
                      </div>
                      <div className="text-sm text-gray-500">
                        {station.distance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Wallet className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('currentBalance') || 'Current Balance'}</p>
                      <p className="text-2xl font-bold text-gray-900">EGP 250</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('addFunds')}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Ticket className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('activeTickets') || 'Active Tickets'}</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('viewAll')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}