const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Buses
  async getBuses(params?: { status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    
    const endpoint = `/buses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async createBus(data: { plateNumber: string; type: string; capacity: number; photoUrl?: string }) {
    return this.request('/buses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Trips
  async getTrips(params?: { status?: string; busId?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.busId) searchParams.append('busId', params.busId)
    
    const endpoint = `/trips${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async createTrip(data: {
    busId: string
    departureTime: string
    arrivalTime: string
    price: number
    supervisorId?: string
    stations?: Array<{
      stationId: string
      arrivalTime: string
      departureTime: string
    }>
  }) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Stations
  async getStations(params?: { search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    
    const endpoint = `/stations${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async createStation(data: {
    name: string
    address?: string
    latitude: number
    longitude: number
    description?: string
  }) {
    return this.request('/stations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Users
  async getUsers(params?: { role?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.role) searchParams.append('role', params.role)
    if (params?.status) searchParams.append('status', params.status)
    
    const endpoint = `/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async createUser(data: {
    email: string
    name?: string
    phone?: string
    role?: string
  }) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Bookings
  async getBookings(params?: { userId?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.userId) searchParams.append('userId', params.userId)
    if (params?.status) searchParams.append('status', params.status)
    
    const endpoint = `/bookings${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async createBooking(data: {
    userId: string
    tripId: string
    stationId: string
    totalPrice: number
    paymentMethod?: string
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Analytics
  async getAnalytics() {
    return this.request('/analytics')
  }
}

export const api = new ApiClient()