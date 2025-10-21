// WebSocket service for real-time updates
export interface BusLocationUpdate {
  busId: string
  tripId: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  timestamp: string
  passengerCount: number
}

export interface TripStatusUpdate {
  tripId: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed'
  currentStation?: string
  nextStation?: string
  eta?: string
  delay?: number
}

export interface NotificationMessage {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  tripId?: string
  userId?: string
}

class WebSocketService {
  private static instance: WebSocketService
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, ((data: any) => void)[]> = new Map()
  private isConnected = false

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  connect(url: string = 'ws://localhost:3001'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnected = true
          this.reconnectAttempts = 0
          this.emit('connected', {})
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.isConnected = false
          this.emit('disconnected', {})
          this.attemptReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.emit('error', error)
          reject(error)
        }
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error)
        reject(error)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
      this.emit('max_reconnect_reached', {})
    }
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'bus_location':
        this.emit('bus_location', data.payload)
        break
      case 'trip_status':
        this.emit('trip_status', data.payload)
        break
      case 'notification':
        this.emit('notification', data.payload)
        break
      case 'passenger_update':
        this.emit('passenger_update', data.payload)
        break
      default:
        console.warn('Unknown message type:', data.type)
    }
  }

  // Subscribe to specific trip updates
  subscribeToTrip(tripId: string): void {
    this.send({
      type: 'subscribe',
      payload: { tripId }
    })
  }

  // Unsubscribe from trip updates
  unsubscribeFromTrip(tripId: string): void {
    this.send({
      type: 'unsubscribe',
      payload: { tripId }
    })
  }

  // Send message to server
  send(data: any): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }

  // Event listeners
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  // Get connection status
  connected(): boolean {
    return this.isConnected
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
  }
}

// React hook for WebSocket
export function useWebSocket() {
  const ws = WebSocketService.getInstance()
  
  return {
    connect: ws.connect.bind(ws),
    disconnect: ws.disconnect.bind(ws),
    subscribeToTrip: ws.subscribeToTrip.bind(ws),
    unsubscribeFromTrip: ws.unsubscribeFromTrip.bind(ws),
    on: ws.on.bind(ws),
    off: ws.off.bind(ws),
    connected: ws.connected.bind(ws),
    send: ws.send.bind(ws)
  }
}

export default WebSocketService