"use client"

import { ReactNode, useEffect, useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

// Mobile Features Components

interface SwipeGestureProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export function SwipeGesture({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  threshold = 50,
  className 
}: SwipeGestureProps) {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = startX - currentX
    const diffY = startY - currentY

    // Prevent default scrolling during horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = startX - endX
    const diffY = startY - endY

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (diffX < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }

    if (Math.abs(diffY) > threshold) {
      if (diffY > 0 && onSwipeUp) {
        onSwipeUp()
      } else if (diffY < 0 && onSwipeDown) {
        onSwipeDown()
      }
    }

    setIsSwiping(false)
  }

  return (
    <div
      className={cn("touch-manipulation", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void> | void
  isRefreshing?: boolean
  threshold?: number
  className?: string
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  isRefreshing = false,
  threshold = 100,
  className 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const startY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    if (diff > 0 && window.scrollY === 0) {
      e.preventDefault()
      setIsPulling(true)
      setPullDistance(Math.min(diff, threshold * 1.5))
      setCanRefresh(diff > threshold)
    }
  }

  const handleTouchEnd = async () => {
    if (canRefresh && !isRefreshing) {
      await onRefresh()
    }
    setIsPulling(false)
    setPullDistance(0)
    setCanRefresh(false)
  }

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance - threshold}px)` }}
      >
        <div className="flex items-center space-x-2 text-gray-600">
          {isRefreshing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm">Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">{canRefresh ? 'Release to refresh' : 'Pull to refresh'}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{ transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)' }}
      >
        {children}
      </div>
    </div>
  )
}

interface OfflineSupportProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export function OfflineSupport({ children, fallback, className }: OfflineSupportProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setIsOfflineMode(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setIsOfflineMode(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline && fallback) {
    return <div className={className}>{fallback}</div>
  }

  return (
    <div className={className}>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-sm text-center z-50">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <span>You're offline. Some features may be limited.</span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
}

interface InfiniteScrollProps {
  children: ReactNode
  onLoadMore: () => Promise<void> | void
  hasMore: boolean
  isLoading?: boolean
  threshold?: number
  className?: string
}

export function InfiniteScroll({ 
  children, 
  onLoadMore, 
  hasMore, 
  isLoading = false,
  threshold = 100,
  className 
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: `${threshold}px`
      }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold])

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore])

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm">Loading more...</span>
            </div>
          ) : (
            <div className="h-8" /> // Spacer for intersection observer
          )}
        </div>
      )}
    </div>
  )
}

interface TouchFeedbackProps {
  children: ReactNode
  className?: string
  feedbackType?: 'ripple' | 'scale' | 'highlight'
}

export function TouchFeedback({ children, className, feedbackType = 'ripple' }: TouchFeedbackProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPressed(true)
    
    if (feedbackType === 'ripple') {
      const touch = e.touches[0]
      const rect = e.currentTarget.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      
      const ripple = { x, y, id: Date.now() }
      setRipples(prev => [...prev, ripple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id))
      }, 600)
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        feedbackType === 'scale' && isPressed && "scale-95 transition-transform",
        feedbackType === 'highlight' && isPressed && "bg-gray-100 transition-colors",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {/* Ripple effects */}
      {feedbackType === 'ripple' && ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute bg-gray-300 rounded-full animate-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </div>
  )
}

// Add CSS for ripple animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    .animate-ripple {
      animation: ripple 0.6s ease-out;
    }
  `
  document.head.appendChild(style)
}

// Performance monitoring utilities
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    domInteractive: 0
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')

      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        domInteractive: navigation.domInteractive - navigation.fetchStart
      })
    }
  }, [])

  return metrics
}

// Lazy loading with intersection observer
export const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!elementRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    observer.observe(elementRef)

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef)
      }
    }
  }, [elementRef, threshold])

  return { isVisible, setElementRef }
}

// Image optimization component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  placeholder,
  onLoad,
  onError 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  return (
    <div className={`relative overflow-hidden ${className || ''}`} style={{ width, height }}>
      {/* Placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">{placeholder}</div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
          <div className="text-red-400 text-sm">Failed to load image</div>
        </div>
      )}
    </div>
  )
}

// Virtual list for long lists
interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  itemHeight: number
  containerHeight: number
  className?: string
}

export function VirtualList<T>({ 
  items, 
  renderItem, 
  itemHeight, 
  containerHeight, 
  className 
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  const handleScroll = useCallback(() => {
    if (containerRef) {
      setScrollTop(containerRef.scrollTop)
    }
  }, [containerRef])

  useEffect(() => {
    if (containerRef) {
      containerRef.addEventListener('scroll', handleScroll)
      return () => containerRef.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, handleScroll])

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  return (
    <div
      ref={setContainerRef}
      className={`overflow-auto ${className || ''}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, width: '100%' }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Debounce utility for search and other input events
// TODO: Fix TypeScript generic parsing issue
// export const useDebounce = <T>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value)
//
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value)
//     }, delay)
//
//     return () => {
//       clearTimeout(handler)
//     }
//   }, [value, delay])
//
//   return debouncedValue
// }

// Throttle utility for scroll events
// TODO: Fix TypeScript generic parsing issue
// export const useThrottle = <T extends (...args: any[]) => any>(
//   callback: T,
//   delay: number
// ): T => {
//   const [lastCall, setLastCall] = useState(0)
//
//   return useCallback(
//     (...args: Parameters<T>) => {
//       const now = Date.now()
//       if (now - lastCall >= delay) {
//         callback(...args)
//         setLastCall(now)
//       }
//     },
//     [callback, delay, lastCall]
//   ) as T
// }

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '',
    downlink: 0,
    rtt: 0
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get network information if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setNetworkInfo({
        effectiveType: connection.effectiveType || '',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      })

      const handleChange = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        })
      }

      connection.addEventListener('change', handleChange)
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        connection.removeEventListener('change', handleChange)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, ...networkInfo }
}

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  })

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        })
      }

      const interval = setInterval(updateMemory, 5000)
      updateMemory()

      return () => clearInterval(interval)
    }
  }, [])

  return memoryInfo
}

// Cache management
interface CacheOptions {
  key: string
  data: any
  ttl?: number // Time to live in milliseconds
}

export const cache = {
  set: ({ key, data, ttl }: CacheOptions) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  },

  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)
      
      // Check if item is expired
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error)
      return null
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove cached data:', error)
    }
  },

  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }
}

// Performance-aware component wrapper
interface PerformanceAwareProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export function PerformanceAware({ children, fallback, className }: PerformanceAwareProps) {
  const [isHighPerformance, setIsHighPerformance] = useState(true)

  useEffect(() => {
    // Check device capabilities
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const hasTouch = 'ontouchstart' in window
      const isSlowConnection = 'connection' in navigator && 
        (navigator as any).connection && 
        (navigator as any).connection.effectiveType === 'slow-2g' ||
        (navigator as any).connection.effectiveType === '2g'

      // Consider it low performance if mobile with slow connection
      setIsHighPerformance(!(isMobile && hasTouch && isSlowConnection))
    }

    checkPerformance()
  }, [])

  if (!isHighPerformance && fallback) {
    return <div className={className}>{fallback}</div>
  }

  return <div className={className}>{children}</div>
}

// Debounce utility for search and other input events
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}