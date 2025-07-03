import type { RootState } from '@/app/store'
import MobileHeader from '@/components/layouts/MobileHeader'
import Sidebar from '@/components/layouts/Sidebar'
import SidebarProvider from '@/components/layouts/SidebarProvider'
import TrainerNavigator from '@/navigators/trainer.routes'
import { useEffect, useState } from 'react'
import { FaBookOpen, FaChartLine } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
import { MdDashboard, MdOutlineMonitorHeart } from 'react-icons/md'
import { useSelector } from 'react-redux'

const TrainerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }

  const getMainContentMargin = () => {
    const baseMargin = 'ml-0' // Default for mobile/collapsed
    if (window.innerWidth >= 768) {
      // md breakpoint
      return isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
    }
    return baseMargin
  }

  // Update margin when sidebar state changes
  useEffect(() => {
    // Force a re-render to apply new margin classes
  }, [isSidebarCollapsed])

  const sidebarItems = [
    {
      id: 'dashboard',
      title: 'Tổng quan',
      icon: <MdDashboard className='w-4 h-4' />,
      href: '/trainer/dashboard'
    },
    {
      id: 'students',
      title: 'Học viên',
      icon: <MdOutlineMonitorHeart className='w-4 h-4' />,
      href: '/trainer/students'
    },
    {
      id: 'courses',
      title: 'Khóa học',
      icon: <FaBookOpen className='w-4 h-4' />,
      href: '/trainer/courses'
    },
    {
      id: 'analytics',
      title: 'Thống kê',
      icon: <FaChartLine className='w-4 h-4' />,
      href: '/trainer/analytics'
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: <IoIosSettings className='w-4 h-4' />,
      href: '/trainer/settings'
    }
  ]

  const sampleUser = {
    name: user?.full_name || 'Trainer Name',
    role: user?.role || 'Trainer',
    avatar: '/avatars/trainer.jpg'
  }

  return (
    <SidebarProvider>
      {/* Mobile Header - fixed trên mobile */}
      <MobileHeader
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        title='CodingLab - Trainer'
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Sidebar - sẽ tự động fixed trên cả desktop và mobile */}
      <Sidebar
        items={sidebarItems}
        user={sampleUser}
        onMobileMenuToggle={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        onCollapsedChange={handleSidebarToggle}
        role='trainer'
      />

      {/* Main Content - với margin động theo trạng thái sidebar */}
      <main
        className={`flex-1 overflow-auto mt-16 md:mt-0 transition-all duration-300 ease-in-out ${getMainContentMargin()}`}
      >
        <div className='p-4 h-full'>
          <TrainerNavigator />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default TrainerLayout
