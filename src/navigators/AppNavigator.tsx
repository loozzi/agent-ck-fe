import UserLayout from '@/layouts/UserLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserAuth from '@/pages/auth/UserAuth'
import SignOut from '@/pages/auth/SignOut'
import Unauthorized from '@/pages/auth/Unauthorized'
import Home from '@/pages/Home'
import MBTI from '@/pages/user/MBTI'

const AppNavigator = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/signin' element={<UserAuth />} />
        <Route path='/signup' element={<UserAuth />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/signout' element={<SignOut />} />
        <Route path='/' element={<Home />} />
        <Route path='/mbti' element={<MBTI />} />

        {/* Redirect root to user dashboard */}
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
