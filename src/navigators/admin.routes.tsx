import type { RouteBrowser } from '@/types/routes'
import { Route, Routes } from 'react-router'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminSetting from '@/pages/admin/Setting'
import UserManagement from '@/pages/admin/UserManagement'

export const adminRoutesConfig: RouteBrowser[] = [
  {
    name: 'Dashboard',
    route: '/admin/dashboard',
    element: <AdminDashboard />,
    exact: true
  },
  {
    name: 'User Management',
    route: '/admin/user-management',
    element: <UserManagement />,
    exact: true
  },
  {
    name: 'Setting',
    route: '/admin/setting',
    element: <AdminSetting />,
    exact: true
  },
    {
        name: 'Subscription',
        route: '/admin/subscription',
        element: <div>Admin Subscription Page</div>, // Placeholder for Subscription page
        exact: true
    }
]

const AdminNavigator = () => {
  return (
    <Routes>
      {adminRoutesConfig.map((route, index) => (
        <Route key={index} path={route.route} element={route.element} />
      ))}
    </Routes>
  )
}

export default AdminNavigator
