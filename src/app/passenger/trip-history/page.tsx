"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Navigation, 
  Clock, 
  Bus, 
  Users, 
  MapPin,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface Trip {
  id: string
  tripNumber: string
  route: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  date: string
  duration: string
  price: number
  status: 'completed' | 'cancelled' | 'upcoming'
  busNumber: string
  driver: string
  seatNumber: string
  distance: string
  rating?: number
  feedback?: string
}

const trips: Trip[] = [
  {
    id: '1',
    tripNumber: 'TRP-2024-001',
    route: 'Tahrir Square → Admin Capital',
    from: 'Tahrir Square',
    to: 'Administrative Capital',
    departureTime: '08:00',
    arrivalTime: '08:45',
    date: '2024-01-15',
    duration: '45 min',
    price: 50,
    status: 'completed',
    busNumber: 'CA 1234',
    driver: 'Ahmed Hassan',
    seatNumber: 'A12',
    distance: '25.3 km',
    rating: 5,
    feedback: 'Excellent service, on time and comfortable.'
  },
  {
    id: '2',
    tripNumber: 'TRP-2024-002',
    route: 'Nasr City → Admin Capital',
    from: 'Nasr City',
    to: 'Administrative Capital',
    departureTime: '09:30',
    arrivalTime: '10:15',
    date: '2024-01-14',
    duration: '45 min',
    price: 45,
    status: 'completed',
    busNumber: 'CA 5678',
    driver: 'Mohamed Ali',
    seatNumber: 'B08',
    distance: '22.1 km',
    rating: 4,
    feedback: 'Good trip, minor delay but driver was professional.'
  },
  {
    id: '3',
    tripNumber: 'TRP-2024-003',
    route: 'Maadi → Tahrir Square',
    from: 'Maadi',
    to: 'Tahrir Square',
    departureTime: '07:00',
    arrivalTime: '07:40',
    date: '2024-01-13',
    duration: '40 min',
    price: 35,
    status: 'completed',
    busNumber: 'CA 9012',
    driver: 'Sara Mahmoud',
    seatNumber: 'C15',
    distance: '18.7 km',
    rating: 5,
    feedback: 'Very smooth ride, would recommend!'
  },
  {
    id: '4',
    tripNumber: 'TRP-2024-004',
    route: 'Heliopolis → Admin Capital',
    from: 'Heliopolis',
    to: 'Administrative Capital',
    departureTime: '10:00',
    arrivalTime: '10:50',
    date: '2024-01-10',
    duration: '50 min',
    price: 40,
    status: 'cancelled',
    busNumber: 'CA 3456',
    driver: 'Khalid Omar',
    seatNumber: 'A03',
    distance: '28.5 km'
  },
  {
    id: '5',
    tripNumber: 'TRP-2024-005',
    route: 'Tahrir Square → Nasr City',
    from: 'Tahrir Square',
    to: 'Nasr City',
    departureTime: '14:00',
    arrivalTime: '14:30',
    date: '2024-01-16',
    duration: '30 min',
    price: 30,
    status: 'upcoming',
    busNumber: 'CA 7890',
    driver: 'Nadia Ahmed',
    seatNumber: 'D22',
    distance: '15.2 km'
  }
]

export default function TripHistory() {
  const { t, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'upcoming': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />
      case 'upcoming': return <Clock className="h-4 w-4" />
      default: return <Navigation className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('completed') || 'Completed'
      case 'cancelled': return t('cancel') || 'Cancelled'
      case 'upcoming': return 'Upcoming'
      default: return status
    }
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const completedTrips = trips.filter(trip => trip.status === 'completed').length
  const cancelledTrips = trips.filter(trip => trip.status === 'cancelled').length
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming').length
  const totalDistance = trips.filter(trip => trip.status === 'completed').reduce((sum, trip) => sum + parseFloat(trip.distance), 0)
  const averageRating = trips.filter(trip => trip.rating).reduce((sum, trip) => sum + (trip.rating || 0), 0) / trips.filter(trip => trip.rating).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('passenger')} - {t('tripHistory') || 'Trip History'}</p>
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
            {t('tripHistory') || 'Trip History'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('viewYourTravelHistory') || 'View your travel history and trip details'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Navigation className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalTrips') || 'Total Trips'}</p>
                    <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('completedTrips') || 'Completed Trips'}</p>
                    <p className="text-2xl font-bold text-gray-900">{completedTrips}</p>
                  </div>
                </div>
                <Star className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalDistance') || 'Total Distance'}</p>
                    <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('averageRating') || 'Average Rating'}</p>
                    <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}/5</p>
                  </div>
                </div>
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder={t('searchTrips') || 'Search trips by route, trip number...'}
                  className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="all">{t('allStatuses') || 'All Statuses'}</option>
                  <option value="completed">{t('completed') || 'Completed'}</option>
                  <option value="cancelled">{t('cancel') || 'Cancelled'}</option>
                  <option value="upcoming">{t('upcoming') || 'Upcoming'}</option>
                </select>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t('export') || 'Export'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trips List */}
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getStatusColor(trip.status)}`}>
                      {getStatusIcon(trip.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{trip.route}</h4>
                        <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">{t('date') || 'Date'}</span>
                          <div className="font-medium">{trip.date}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">{t('time') || 'Time'}</span>
                          <div className="font-medium">{trip.departureTime} - {trip.arrivalTime}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">{t('duration') || 'Duration'}</span>
                          <div className="font-medium">{trip.duration}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">{t('distance') || 'Distance'}</span>
                          <div className="font-medium">{trip.distance}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{t('bus') || 'Bus'}</span>
                          <div className="font-medium">{trip.busNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">{t('driver') || 'Driver'}</span>
                          <div className="font-medium">{trip.driver}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">{t('seat') || 'Seat'}</span>
                          <div className="font-medium">{trip.seatNumber}</div>
                        </div>
                      </div>

                      {trip.rating && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= (trip.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{trip.rating}/5</span>
                          </div>
                          {trip.feedback && (
                            <p className="text-sm text-gray-600 mt-1">"{trip.feedback}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-blue-600 mb-2">
                      EGP {trip.price}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTrip(trip)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {trip.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('noTripsFound') || 'No trips found'}
              </h3>
              <p className="text-gray-500">
                {t('noTripsMatchFilters') || 'No trips match the selected filters'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Trip Detail Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{selectedTrip.tripNumber}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTrip(null)}
                  >
                    ×
                  </Button>
                </div>
                <CardDescription>{selectedTrip.route}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('journeyDetails') || 'Journey Details'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('from') || 'From'}</span>
                          <span className="font-medium">{selectedTrip.from}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('to') || 'To'}</span>
                          <span className="font-medium">{selectedTrip.to}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('date') || 'Date'}</span>
                          <span className="font-medium">{selectedTrip.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('time') || 'Time'}</span>
                          <span className="font-medium">{selectedTrip.departureTime} - {selectedTrip.arrivalTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('duration') || 'Duration'}</span>
                          <span className="font-medium">{selectedTrip.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('distance') || 'Distance'}</span>
                          <span className="font-medium">{selectedTrip.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('tripDetails') || 'Trip Details'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('busNumber') || 'Bus Number'}</span>
                          <span className="font-medium">{selectedTrip.busNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('driver') || 'Driver'}</span>
                          <span className="font-medium">{selectedTrip.driver}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('seatNumber') || 'Seat Number'}</span>
                          <span className="font-medium">{selectedTrip.seatNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('price') || 'Price'}</span>
                          <span className="font-medium">EGP {selectedTrip.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('status') || 'Status'}</span>
                          <Badge className={`text-xs ${getStatusColor(selectedTrip.status)}`}>
                            {getStatusText(selectedTrip.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedTrip.rating && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('yourRating') || 'Your Rating'}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-5 w-5 ${star <= (selectedTrip.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{selectedTrip.rating}/5</span>
                        </div>
                        {selectedTrip.feedback && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">"{selectedTrip.feedback}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('tripActions') || 'Trip Actions'}</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          {t('downloadReceipt') || 'Download Receipt'}
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          {t('viewRouteMap') || 'View Route Map'}
                        </Button>
                        {selectedTrip.status === 'completed' && !selectedTrip.rating && (
                          <Button className="w-full">
                            <Star className="h-4 w-4 mr-2" />
                            {t('rateTrip') || 'Rate Trip'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}