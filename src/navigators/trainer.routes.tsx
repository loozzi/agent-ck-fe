import FeedbackLogger from '@/pages/trainer/FeedbackLogger'
import PromtDetail from '@/pages/trainer/PromtDetail'
import PromtManagement from '@/pages/trainer/PromtManagement'
import RuleController from '@/pages/trainer/RuleController'
import TrainerDashboard from '@/pages/trainer/TrainerDashboard'
import type { RouteBrowser } from '@/types/routes'
import { Routes, Route, Navigate } from 'react-router'

export const trainerRouterConfig: RouteBrowser[] = [
  {
    route: '/dashboard',
    element: <TrainerDashboard />,
    exact: true,
    name: 'Dashboard'
  },
  {
    route: '/prompts',
    element: <PromtManagement />,
    exact: true,
    name: 'Quản lý prompts'
  },
  {
    route: '/rules-management',
    element: <RuleController />,
    exact: true,
    name: 'Quản lý rules logic'
  },
  {
    route: '/feedback',
    element: <FeedbackLogger />,
    exact: true,
    name: 'Feedback logger'
  },
  {
    route: '/prompts/:id',
    element: <PromtDetail />,
    exact: true,
    name: 'Chi tiết prompt'
  }
]

const TrainerNavigator = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path='/' element={<Navigate to='/dashboard' replace />} />

      {trainerRouterConfig.map((route, index) => (
        <Route key={index} path={route.route} element={route.element} />
      ))}
    </Routes>
  )
}
export default TrainerNavigator
