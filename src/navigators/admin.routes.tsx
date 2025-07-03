import type { RouteBrowser } from '@/types/routes'
import { Route, Routes } from 'react-router'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminSetting from '@/pages/admin/Setting'
import UserManagement from '@/pages/admin/UserManagement'
import Subscription from '@/pages/admin/Subscription'

export const adminRoutesConfig: RouteBrowser[] = [
  {
    name: 'Dashboard',
    route: 'dashboard', // Đã có
    element: <AdminDashboard />,
    exact: true
  },
  {
    name: 'User Management',
    route: 'user-management',
    element: <UserManagement />,
    exact: true
  },
  {
    name: 'Setting',
    route: 'setting',
    element: <AdminSetting />,
    exact: true
  },
  {
    name: 'Subscription',
    route: 'subscription',
    element: <Subscription />,
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
