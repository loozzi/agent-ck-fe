import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import AdminLayout from '@/layouts/AdminLayout'
import TrainerLayout from '@/layouts/TrainerLayout'
import UserLayout from '@/layouts/UserLayout'
import SignOut from '@/pages/auth/SignOut'
import Unauthorized from '@/pages/auth/Unauthorized'
import UserAuth from '@/pages/auth/UserAuth'
import Home from '@/pages/Home'
import Survey from '@/pages/user/Survey'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppNavigator = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/signin' element={<UserAuth />} />
        {/* <Route path='/signup' element={<UserAuth />} /> */}
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/signout' element={<SignOut />} />
        <Route path='/' element={<Home />} />
        <Route
          path='/survey'
          element={
            <ProtectedRoute requiredRoles={['user']}>
              <Survey />
            </ProtectedRoute>
          }
        />

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

        {/* Protected trainer routes */}
        <Route
          path='/trainer/*'
          element={
            <ProtectedRoute requiredRoles={['trainer']}>
              <TrainerLayout />
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
