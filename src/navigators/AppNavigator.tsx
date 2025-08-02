import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import AdminLayout from '@/layouts/AdminLayout'
import TrainerLayout from '@/layouts/TrainerLayout'
import UserLayout from '@/layouts/UserLayout'
import SignOut from '@/pages/auth/SignOut'
import Unauthorized from '@/pages/auth/Unauthorized'
import UserAuth from '@/pages/auth/UserAuth'
import ZaloCallback from '@/pages/auth/ZaloCallback'
import Home from '@/pages/Home'
import Survey from '@/pages/user/Survey'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppNavigator = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/signin' element={<UserAuth />} />
        <Route path='/survey' element={<Survey />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/signout' element={<SignOut />} />
        <Route path='/' element={<Home />} />
        <Route path='/auth/zalo/callback' element={<ZaloCallback />} />
        <Route
          path='/zalo_verifierGTQ_Sw3PQtbnh-zkbjb3HcxLvtk2ep4jCpGn.html'
          element={
            <div
              dangerouslySetInnerHTML={{
                __html: `
                <!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta property="zalo-platform-site-verification" content="GTQ_Sw3PQtbnh-zkbjb3HcxLvtk2ep4jCpGn" />
                </head>

                <body>
                There Is No Limit To What You Can Accomplish Using Zalo!
                </body>

                </html>
                `
              }}
            />
          }
        />
        {/* <Route
          path='/watchlist'
          element={
            <ProtectedRoute requiredRoles={['user']}>
              <Watchlist />
            </ProtectedRoute>
          }
        /> */}

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
            <ProtectedRoute requiredRoles={['trainer', 'admin']}>
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
