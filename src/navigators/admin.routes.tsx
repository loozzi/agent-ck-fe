import AdminDashboard from '@/pages/admin/AdminDashboard'
import LessonManagement from '@/pages/admin/Lesson'
import LessonCreate from '@/pages/admin/LessonCreate'
import LessonDetail from '@/pages/admin/LessonDetail'
import PricingManagement from '@/pages/admin/PricingManagement'
import AdminSetting from '@/pages/admin/Setting'
import Subscription from '@/pages/admin/Subscription'
import SurveyManagement from '@/pages/admin/SurveyManagement'
import UserManagement from '@/pages/admin/UserManagement'
import CategoryManagement from '@/pages/trainer/CategoryManagement'
import PromtDetail from '@/pages/trainer/PromtDetail'
import PromtManagement from '@/pages/trainer/PromtManagement'
import RuleController from '@/pages/trainer/RuleController'
import type { RouteBrowser } from '@/types/routes'
import { Route, Routes } from 'react-router'

export const adminRoutesConfig: RouteBrowser[] = [
  {
    name: 'Dashboard',
    route: 'dashboard',
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
  },
  {
    route: 'prompts',
    element: <PromtManagement />,
    exact: true,
    name: 'Quản lý prompts'
  },
  {
    route: 'rules-management',
    element: <RuleController />,
    exact: true,
    name: 'Quản lý rules logic'
  },
  {
    route: 'prompts/:id',
    element: <PromtDetail />,
    exact: true,
    name: 'Chi tiết prompt'
  },
  {
    route: 'category-management',
    element: <CategoryManagement />,
    exact: true,
    name: 'Quản lý danh mục'
  },
  {
    name: 'Lesson Management',
    route: 'lesson-management',
    element: <LessonManagement />,
    exact: true
  },
  {
    name: 'Lesson Create',
    route: 'lesson-management/create',
    element: <LessonCreate />,
    exact: true
  },
  {
    name: 'Lesson Detail',
    route: 'lesson-management/:id',
    element: <LessonDetail />,
    exact: true
  },
  {
    name: 'Survey Management',
    route: 'survey-management',
    element: <SurveyManagement />,
    exact: true
  },
  {
    name: 'Planning',
    route: 'planning',
    element: <PricingManagement />,
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
