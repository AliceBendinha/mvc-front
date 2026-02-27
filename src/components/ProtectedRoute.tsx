import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner } from './States'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'gerente' | 'usuario'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, role, isLoading, authDisabled } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Verificar autenticação
    }
  }, [isAuthenticated, isLoading])

  if (isLoading && !authDisabled) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated && !authDisabled) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole && !authDisabled) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
