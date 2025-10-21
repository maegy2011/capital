'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface BusLocation {
  busId: string
  latitude: number
  longitude: number
  speed: number
  timestamp: string
}

interface TripStatus {
  tripId: string
  status: string
  currentLocation: string
  nextStop: string
  estimatedArrival: string
}

interface Alert {
  type: string
  severity: string
  title: string
  description: string
  busId: string
  location: string
  timestamp: string
}

interface Delay {
  tripId: string
  busId: string
  delayMinutes: number
  reason: string
  affectedStations: string[]
  timestamp: string
}

export function useSupervisorSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [busLocations, setBusLocations] = useState<Map<string, BusLocation>>(new Map())
  const [tripStatuses, setTripStatuses] = useState<Map<string, TripStatus>>(new Map())
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [delays, setDelays] = useState<Delay[]>([])
  const [realTimeData, setRealTimeData] = useState<any>(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling']
    })

    const socket = socketRef.current

    // Connect to socket
    socket.on('connect', () => {
      console.log('Connected to socket server')
      setIsConnected(true)
      
      // Authenticate as supervisor
      socket.emit('authenticate', {
        role: 'SUPERVISOR',
        userId: 'supervisor-1' // This would come from auth context
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setIsConnected(false)
    })

    socket.on('authenticated', (data) => {
      console.log('Authenticated as supervisor:', data)
      
      // Request real-time data
      socket.emit('request_real_time_data')
    })

    // Listen for bus location updates
    socket.on('bus_location_updated', (data: BusLocation) => {
      setBusLocations(prev => {
        const newMap = new Map(prev)
        newMap.set(data.busId, data)
        return newMap
      })
    })

    // Listen for trip status updates
    socket.on('trip_status_updated', (data: TripStatus) => {
      setTripStatuses(prev => {
        const newMap = new Map(prev)
        newMap.set(data.tripId, data)
        return newMap
      })
    })

    // Listen for new alerts
    socket.on('new_alert', (data: Alert) => {
      setAlerts(prev => [data, ...prev].slice(0, 50)) // Keep last 50 alerts
    })

    // Listen for new delays
    socket.on('new_delay', (data: Delay) => {
      setDelays(prev => [data, ...prev].slice(0, 50)) // Keep last 50 delays
    })

    // Listen for real-time data
    socket.on('real_time_data', (data) => {
      setRealTimeData(data)
    })

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  // Function to send bus location update (simulated)
  const sendBusLocationUpdate = (data: BusLocation) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('bus_location_update', data)
    }
  }

  // Function to send trip status update (simulated)
  const sendTripStatusUpdate = (data: TripStatus) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('trip_status_update', data)
    }
  }

  // Function to create alert (simulated)
  const createAlert = (data: Omit<Alert, 'timestamp'>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('alert_created', data)
    }
  }

  // Function to create delay (simulated)
  const createDelay = (data: Omit<Delay, 'timestamp'>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('delay_created', data)
    }
  }

  return {
    isConnected,
    busLocations,
    tripStatuses,
    alerts,
    delays,
    realTimeData,
    sendBusLocationUpdate,
    sendTripStatusUpdate,
    createAlert,
    createDelay
  }
}