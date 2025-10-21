"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Calendar,
  Navigation
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

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

interface TicketCardProps {
  ticket: Ticket
  onViewDetails: (ticket: Ticket) => void
  onDownload: (ticket: Ticket) => void
  onShare: (ticket: Ticket) => void
}

export default function TicketCard({ ticket, onViewDetails, onDownload, onShare }: TicketCardProps) {
  const { t } = useLanguage()

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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-blue-600" />
            {ticket.ticketNumber}
          </CardTitle>
          <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
            {getStatusIcon(ticket.status)}
            <span className="ml-1">{getStatusText(ticket.status)}</span>
          </Badge>
        </div>
        <CardDescription>{ticket.route}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('date') || 'Date'}</span>
            </div>
            <div className="font-medium">{ticket.date}</div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('time') || 'Time'}</span>
            </div>
            <div className="font-medium">{ticket.departureTime} - {ticket.arrivalTime}</div>
          </div>

          {/* Route */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Navigation className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{t('route') || 'Route'}</span>
            </div>
            <div className="font-medium">{ticket.from} → {ticket.to}</div>
          </div>

          {/* Seat and Bus */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-gray-600">{t('seat') || 'Seat'}</span>
              </div>
              <div className="font-medium">{ticket.seatNumber}</div>
            </div>
            <div>
              <div className="flex items-center">
                <Bus className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-gray-600">{t('bus') || 'Bus'}</span>
              </div>
              <div className="font-medium">{ticket.busNumber}</div>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-lg font-bold text-blue-600">
              {ticket.currency || 'EGP'} {ticket.price}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(ticket)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {ticket.status === 'active' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDownload(ticket)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onShare(ticket)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}