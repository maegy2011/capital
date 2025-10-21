// Route service for calculating paths using OSRM API
export interface RoutePoint {
  lat: number
  lng: number
}

export interface RouteData {
  coordinates: [number, number][]
  duration: number // in seconds
  distance: number // in meters
  geometry: string
}

export interface TurnByTurnDirection {
  instruction: string
  distance: number
  duration: number
  type: string
}

class RouteService {
  private static instance: RouteService

  static getInstance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService()
    }
    return RouteService.instance
  }

  /**
   * Calculate route between two points using OSRM API
   */
  async calculateRoute(
    start: RoutePoint,
    end: RoutePoint
  ): Promise<RouteData> {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        return {
          coordinates: route.geometry.coordinates,
          duration: route.duration,
          distance: route.distance,
          geometry: route.geometry
        }
      } else {
        throw new Error('No route found')
      }
    } catch (error) {
      console.error('Error calculating route:', error)
      // Fallback to direct line if API fails
      return this.getDirectRoute(start, end)
    }
  }

  /**
   * Get turn-by-turn directions for a route
   */
  async getTurnByTurnDirections(
    start: RoutePoint,
    end: RoutePoint
  ): Promise<TurnByTurnDirection[]> {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?steps=true`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        const legs = data.routes[0].legs
        if (legs && legs.length > 0) {
          return legs[0].steps.map((step: any) => ({
            instruction: step.maneuver.instruction || 'Continue',
            distance: step.distance,
            duration: step.duration,
            type: step.maneuver.type || 'straight'
          }))
        }
      }
      
      return []
    } catch (error) {
      console.error('Error getting directions:', error)
      return []
    }
  }

  /**
   * Fallback method - direct line between two points
   */
  private getDirectRoute(start: RoutePoint, end: RoutePoint): RouteData {
    const distance = this.calculateDistance(start, end)
    const duration = Math.round(distance / 1000 * 60 * 2) // Rough estimate: 2 minutes per km
    
    return {
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat]
      ],
      duration,
      distance,
      geometry: 'direct'
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(start: RoutePoint, end: RoutePoint): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = this.toRadians(end.lat - start.lat)
    const dLng = this.toRadians(end.lng - start.lng)
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(start.lat)) * Math.cos(this.toRadians(end.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Convert OSRM coordinates to Leaflet format [lat, lng]
   */
  static convertToLeafletCoordinates(coordinates: [number, number][]): [number, number][] {
    return coordinates.map(coord => [coord[1], coord[0]]) as [number, number][]
  }

  /**
   * Format duration for display
   */
  static formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}min`
    }
  }

  /**
   * Format distance for display
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    } else {
      return `${(meters / 1000).toFixed(1)}km`
    }
  }
}

export default RouteService