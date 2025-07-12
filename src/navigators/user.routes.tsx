import UserDashboard from '@/pages/user/Dashboard'
import Learning from '@/pages/user/Learning'
import Payment from '@/pages/user/Payment'
import Planning from '@/pages/user/Planning'
import Portfolio from '@/pages/user/Portfolio'
import Setting from '@/pages/user/Setting'
import TransactionHistory from '@/pages/user/TransactionHistory'
import StockChartDemo from '@/pages/demo/StockChartDemo'
import type { RouteBrowser } from '@/types/routes'
import { Route, Routes } from 'react-router'
import Strategy from '@/pages/user/Strategy'

export const userRoutesConfig: RouteBrowser[] = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    element: <UserDashboard />,
    exact: true
  },
  {
    name: 'Portfolio',
    route: 'portfolio',
    element: <Portfolio />,
    exact: true
  },
  {
    name: 'Learning',
    route: 'learning',
    element: <Learning />,
    exact: true
  },
  {
    name: 'Payment',
    route: 'payment',
    element: <Payment />,
    exact: true
  },
  {
    name: 'Subscription',
    route: 'subscription',
    element: <Planning />,
    exact: true
  },
  {
    name: 'Setting',
    route: 'setting',
    element: <Setting />,
    exact: true
  },
  {
    name: 'History',
    route: 'transaction-history',
    element: <TransactionHistory />,
    exact: true
  },
  {
    name: 'Chart Demo',
    route: 'chart-demo',
    element: <StockChartDemo />,
    exact: true
  },
  {
    name: 'strategy',
    route: 'strategy',
    element: <Strategy />,
    exact: true
  }
]

const UserNavigator = () => {
  return (
    <Routes>
      {userRoutesConfig.map((route, index) => (
        <Route key={index} path={route.route} element={route.element} />
      ))}
    </Routes>
  )
}

export default UserNavigator
