import { useAppSelector } from '@/app/hook'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation()

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  // TODO: Implement role check
  const userRole = useAppSelector((state) => state.auth.user?.role || '')

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to='/signin' state={{ from: location }} replace />
  }

  // Check if user has required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => role === userRole)
    if (!hasRequiredRole) {
      return <Navigate to='/' replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
