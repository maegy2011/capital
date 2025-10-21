"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  header?: {
    title: string
    subtitle?: string
    actions?: ReactNode
  }
  footer?: ReactNode
  loading?: boolean
}

export function MobileLayout({ 
  children, 
  className, 
  header, 
  footer, 
  loading = false 
}: MobileLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gray-50 flex flex-col",
      "max-w-md mx-auto w-full", // Mobile constraint
      className
    )}>
      {/* Header */}
      {header && (
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {header.title}
              </h1>
              {header.subtitle && (
                <p className="text-sm text-gray-500 truncate">
                  {header.subtitle}
                </p>
              )}
            </div>
            {header.actions && (
              <div className="ml-4 flex-shrink-0">
                {header.actions}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto",
        "px-4 py-4", // Mobile padding
        loading && "opacity-50 pointer-events-none"
      )}>
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer className="bg-white border-t border-gray-200 px-4 py-3">
          {footer}
        </footer>
      )}
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function MobileCard({ 
  children, 
  className, 
  title, 
  subtitle, 
  action,
  padding = 'md'
}: MobileCardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200",
      paddingClasses[padding],
      className
    )}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-3 last:mb-0">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="ml-3 flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

interface MobileListProps {
  children: ReactNode
  className?: string
  divided?: boolean
}

export function MobileList({ children, className, divided = true }: MobileListProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
      className
    )}>
      {divided ? (
        <div className="divide-y divide-gray-100">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

interface MobileListItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export function MobileListItem({ 
  children, 
  className, 
  onClick, 
  disabled = false,
  leading,
  trailing
}: MobileListItemProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 flex items-center",
        !disabled && onClick && "active:bg-gray-50 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {leading && (
        <div className="mr-3 flex-shrink-0">
          {leading}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {trailing && (
        <div className="ml-3 flex-shrink-0">
          {trailing}
        </div>
      )}
    </div>
  )
}

interface MobileButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function MobileButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick
}: MobileButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        loading && "cursor-not-allowed opacity-75",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  )
}

interface MobileBottomNavProps {
  items: Array<{
    id: string
    label: string
    icon: ReactNode
    active?: boolean
    onClick?: () => void
  }>
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-[60px]",
              item.active 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className="text-xl mb-1">
              {item.icon}
            </div>
            <span className="text-xs font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}