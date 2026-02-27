import React from 'react'
import { Loader } from 'lucide-react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className={`${sizes[size]} animate-spin text-primary-600`} />
          <p className="text-neutral-text">Carregando...</p>
        </div>
      </div>
    )
  }

  return <Loader className={`${sizes[size]} animate-spin text-primary-600`} />
}

export const EmptyState: React.FC<{
  icon?: React.ReactNode
  title: string
  description?: string
}> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-neutral-muted">{icon}</div>}
      <h3 className="text-lg font-semibold text-neutral-text mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-muted">{description}</p>}
    </div>
  )
}

export const ErrorState: React.FC<{
  title: string
  message: string
  onRetry?: () => void
}> = ({ title, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-red-200 rounded-lg bg-red-50">
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-sm text-red-700 mb-4 text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  )
}
