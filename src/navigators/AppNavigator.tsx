import UserLayout from '@/layouts/UserLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserAuth from '@/pages/auth/UserAuth'
import SignOut from '@/pages/auth/SignOut'
import Unauthorized from '@/pages/auth/Unauthorized'

const AppNavigator = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/signin' element={<UserAuth />} />
        <Route path='/signup' element={<UserAuth />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/signout' element={<SignOut />} />

        {/* Protected user routes */}
        <Route
          path='/*'
          element={
            <ProtectedRoute requiredRoles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }
        />

        {/* Protected admin routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Default protected route */}
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppNavigator
