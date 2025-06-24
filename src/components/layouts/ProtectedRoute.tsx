import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation()

  // TODO: Implement authentication check
  const isAuthenticated = true

  // TODO: Implement role check
  const userRoles = ['user'] // This should come from your auth context/store

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // Check if user has required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))
    if (!hasRequiredRole) {
      return <Navigate to='/unauthorized' replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
