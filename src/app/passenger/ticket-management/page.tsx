"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Ticket, 
  QrCode, 
  Clock, 
  MapPin, 
  Bus, 
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  Share,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Wallet,
  Star
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

interface Ticket {
  id: string
  ticketNumber: string
  route: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  date: string
  price: number
  status: 'active' | 'used' | 'expired' | 'cancelled'
  seatNumber: string
  busNumber: string
  qrCode: string
  purchaseDate: string
  passengerName: string
}

const tickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2024-001',
    route: 'Tahrir Square → Admin Capital',
    from: 'Tahrir Square',
    to: 'Administrative Capital',
    departureTime: '08:00',
    arrivalTime: '08:45',
    date: '2024-01-15',
    price: 50,
    status: 'active',
    seatNumber: 'A12',
    busNumber: 'CA 1234',
    qrCode: 'QR-001',
    purchaseDate: '2024-01-10',
    passengerName: 'Ahmed Hassan'
  },
  {
    id: '2',
    ticketNumber: 'TKT-2024-002',
    route: 'Nasr City → Admin Capital',
    from: 'Nasr City',
    to: 'Administrative Capital',
    departureTime: '09:30',
    arrivalTime: '10:15',
    date: '2024-01-16',
    price: 45,
    status: 'active',
    seatNumber: 'B08',
    busNumber: 'CA 5678',
    qrCode: 'QR-002',
    purchaseDate: '2024-01-12',
    passengerName: 'Ahmed Hassan'
  },
  {
    id: '3',
    ticketNumber: 'TKT-2024-003',
    route: 'Maadi → Tahrir Square',
    from: 'Maadi',
    to: 'Tahrir Square',
    departureTime: '07:00',
    arrivalTime: '07:40',
    date: '2024-01-14',
    price: 35,
    status: 'used',
    seatNumber: 'C15',
    busNumber: 'CA 9012',
    qrCode: 'QR-003',
    purchaseDate: '2024-01-13',
    passengerName: 'Ahmed Hassan'
  },
  {
    id: '4',
    ticketNumber: 'TKT-2024-004',
    route: 'Heliopolis → Admin Capital',
    from: 'Heliopolis',
    to: 'Administrative Capital',
    departureTime: '10:00',
    arrivalTime: '10:50',
    date: '2024-01-10',
    price: 40,
    status: 'expired',
    seatNumber: 'A03',
    busNumber: 'CA 3456',
    qrCode: 'QR-004',
    purchaseDate: '2024-01-08',
    passengerName: 'Ahmed Hassan'
  }
]

export default function TicketManagement() {
  const { t, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'used': return 'bg-blue-100 text-blue-700'
      case 'expired': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'used': return <CheckCircle className="h-4 w-4" />
      case 'expired': return <Clock className="h-4 w-4" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />
      default: return <Ticket className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active') || 'Active'
      case 'used': return t('used') || 'Used'
      case 'expired': return t('expired') || 'Expired'
      case 'cancelled': return t('cancel') || 'Cancelled'
      default: return status
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.to.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const activeTickets = tickets.filter(ticket => ticket.status === 'active').length
  const usedTickets = tickets.filter(ticket => ticket.status === 'used').length
  const totalSpent = tickets.reduce((sum, ticket) => sum + ticket.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
                  <p className="text-sm text-gray-500">{t('passenger')} - {t('ticketManagement') || 'Ticket Management'}</p>
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
            {t('ticketManagement') || 'Ticket Management'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('manageYourTickets') || 'Manage your tickets, view details, and download QR codes'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalTickets') || 'Total Tickets'}</p>
                    <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                  </div>
                </div>
                <Star className="h-5 w-5 text-blue-500" />
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
                    <p className="text-sm text-gray-500">{t('activeTickets') || 'Active Tickets'}</p>
                    <p className="text-2xl font-bold text-gray-900">{activeTickets}</p>
                  </div>
                </div>
                <QrCode className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('totalSpent') || 'Total Spent'}</p>
                    <p className="text-2xl font-bold text-gray-900">EGP {totalSpent}</p>
                  </div>
                </div>
                <Wallet className="h-5 w-5 text-purple-500" />
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
                  placeholder={t('searchTickets') || 'Search tickets by route, ticket number...'}
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
                  <option value="active">{t('active') || 'Active'}</option>
                  <option value="used">{t('used') || 'Used'}</option>
                  <option value="expired">{t('expired') || 'Expired'}</option>
                  <option value="cancelled">{t('cancel') || 'Cancelled'}</option>
                </select>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('bookNewTicket') || 'Book New Ticket'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ticket.ticketNumber}</CardTitle>
                  <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </Badge>
                </div>
                <CardDescription>{ticket.route}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('date') || 'Date'}</span>
                    <span className="font-medium">{ticket.date}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('time') || 'Time'}</span>
                    <span className="font-medium">{ticket.departureTime} - {ticket.arrivalTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('seat') || 'Seat'}</span>
                    <span className="font-medium">{ticket.seatNumber}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('bus') || 'Bus'}</span>
                    <span className="font-medium">{ticket.busNumber}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-lg font-bold text-blue-600">
                      EGP {ticket.price}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {ticket.status === 'active' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('noTicketsFound') || 'No tickets found'}
              </h3>
              <p className="text-gray-500">
                {t('noTicketsMatchFilters') || 'No tickets match the selected filters'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{selectedTicket.ticketNumber}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTicket(null)}
                  >
                    ×
                  </Button>
                </div>
                <CardDescription>{selectedTicket.route}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('journeyDetails') || 'Journey Details'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('from') || 'From'}</span>
                          <span className="font-medium">{selectedTicket.from}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('to') || 'To'}</span>
                          <span className="font-medium">{selectedTicket.to}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('date') || 'Date'}</span>
                          <span className="font-medium">{selectedTicket.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('time') || 'Time'}</span>
                          <span className="font-medium">{selectedTicket.departureTime} - {selectedTicket.arrivalTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('ticketDetails') || 'Ticket Details'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('seatNumber') || 'Seat Number'}</span>
                          <span className="font-medium">{selectedTicket.seatNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('busNumber') || 'Bus Number'}</span>
                          <span className="font-medium">{selectedTicket.busNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('price') || 'Price'}</span>
                          <span className="font-medium">EGP {selectedTicket.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('status') || 'Status'}</span>
                          <Badge className={`text-xs ${getStatusColor(selectedTicket.status)}`}>
                            {getStatusText(selectedTicket.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('qrCode') || 'QR Code'}</h4>
                      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">{selectedTicket.qrCode}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('passengerInfo') || 'Passenger Information'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('name') || 'Name'}</span>
                          <span className="font-medium">{selectedTicket.passengerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('purchaseDate') || 'Purchase Date'}</span>
                          <span className="font-medium">{selectedTicket.purchaseDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        {t('download') || 'Download'}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share className="h-4 w-4 mr-2" />
                        {t('share') || 'Share'}
                      </Button>
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