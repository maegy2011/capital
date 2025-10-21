'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  MapPin,
  Users,
  Bus,
  Zap,
  MoreVertical
} from 'lucide-react'

interface MobileCardProps {
  title: string
  subtitle?: string
  status?: string
  statusColor?: string
  progress?: number
  progressLabel?: string
  actions?: {
    primary?: {
      label: string
      onClick: () => void
      icon?: any
    }
    secondary?: {
      label: string
      onClick: () => void
      icon?: any
    }
  }
  children?: React.ReactNode
  footer?: React.ReactNode
  onClick?: () => void
}

export default function MobileCard({
  title,
  subtitle,
  status,
  statusColor = 'bg-gray-100 text-gray-800',
  progress,
  progressLabel,
  actions,
  children,
  footer,
  onClick
}: MobileCardProps) {
  return (
    <Card 
      className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {status && (
            <Badge className={`text-xs ${statusColor}`}>
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {children}
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{progressLabel || 'Progress'}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {actions && (
          <div className="flex space-x-2 mt-4">
            {actions.primary && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  actions.primary?.onClick()
                }}
              >
                {actions.primary.icon && <actions.primary.icon className="h-4 w-4 mr-1" />}
                {actions.primary.label}
              </Button>
            )}
            {actions.secondary && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  actions.secondary?.onClick()
                }}
              >
                {actions.secondary.icon && <actions.secondary.icon className="h-4 w-4" />}
              </Button>
            )}
          </div>
        )}
        
        {footer && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized mobile cards
export function MobileTripCard({
  trip,
  onViewDetails,
  onContact
}: {
  trip: any
  onViewDetails: () => void
  onContact: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-700'
      case 'delayed': return 'bg-yellow-100 text-yellow-700'
      case 'early': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <MobileCard
      title={trip.route}
      subtitle={`Bus ${trip.bus} - ${trip.driver}`}
      status={trip.status.replace('-', ' ')}
      statusColor={getStatusColor(trip.status)}
      progress={trip.progress}
      progressLabel="Trip Progress"
      actions={{
        primary: {
          label: 'Details',
          onClick: onViewDetails,
          icon: Eye
        },
        secondary: {
          label: 'Contact',
          onClick: onContact,
          icon: MessageSquare
        }
      }}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current:</span>
          <span className="font-medium">{trip.currentLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Next Stop:</span>
          <span className="font-medium">{trip.nextStop}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Passengers:</span>
          <span className="font-medium">{trip.passengers}</span>
        </div>
      </div>
    </MobileCard>
  )
}

export function MobileAlertCard({
  alert,
  onViewDetails,
  onResolve
}: {
  alert: any
  onViewDetails: () => void
  onResolve: () => void
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <MobileCard
      title={alert.title}
      subtitle={alert.bus}
      status={alert.severity}
      statusColor={getSeverityColor(alert.severity)}
      actions={{
        primary: alert.resolved ? undefined : {
          label: 'Resolve',
          onClick: onResolve,
          icon: CheckCircle
        },
        secondary: {
          label: 'Details',
          onClick: onViewDetails,
          icon: Eye
        }
      }}
    >
      <div className="space-y-2 text-sm">
        <p className="text-gray-600">{alert.description}</p>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{alert.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">{alert.time}</span>
        </div>
      </div>
    </MobileCard>
  )
}

export function MobileBusCard({
  bus,
  onViewDetails,
  onEdit
}: {
  bus: any
  onViewDetails: () => void
  onEdit: () => void
}) {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <MobileCard
      title={bus.plateNumber}
      subtitle={`${bus.type} - ${bus.capacity} seats`}
      status={bus.isActive ? 'Active' : 'Inactive'}
      statusColor={getStatusColor(bus.isActive)}
      actions={{
        primary: {
          label: 'Details',
          onClick: onViewDetails,
          icon: Eye
        },
        secondary: {
          label: 'Edit',
          onClick: onEdit,
          icon: MoreVertical
        }
      }}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium">{bus.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Capacity:</span>
          <span className="font-medium">{bus.capacity} seats</span>
        </div>
        {bus.currentLocation && (
          <div className="flex items-center text-green-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="text-xs">Location tracked</span>
          </div>
        )}
      </div>
    </MobileCard>
  )
}