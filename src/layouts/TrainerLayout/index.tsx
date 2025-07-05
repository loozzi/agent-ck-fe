import { useAppSelector } from '@/app/hook'
import MobileHeader from '@/components/layouts/MobileHeader'
import Sidebar from '@/components/layouts/Sidebar'
import SidebarProvider from '@/components/layouts/SidebarProvider'
import TrainerNavigator from '@/navigators/trainer.routes'
import { useEffect, useState } from 'react'
import { FaBookOpen, FaChartLine } from 'react-icons/fa'
import { MdDashboard, MdOutlineMonitorHeart } from 'react-icons/md'
import type { RouteItem } from '../UserLayout'

const TrainerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const user = useAppSelector((state) => state.auth.user)

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarCollapsed(false) // On mobile, sidebar is never really "collapsed"
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleSidebarToggle = (collapsed: boolean) => {
    if (!isMobile) {
      setIsSidebarCollapsed(collapsed)
    }
  }

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) {
      return 'ml-0' // No margin on mobile
    }
    return isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64' // 64px when collapsed, 256px when expanded
  }

  const sidebarItems: RouteItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <MdDashboard className='w-4 h-4' />,
      href: '/trainer/dashboard'
    },
    {
      id: 'prompts',
      title: 'Quản lý prompts',
      icon: <MdOutlineMonitorHeart className='w-4 h-4' />,
      href: '/trainer/prompts'
    },
    {
      id: 'rules-management',
      title: 'Quản lý rules logic',
      icon: <FaBookOpen className='w-4 h-4' />,
      href: '/trainer/rules-management'
    },
    {
      id: 'feedback',
      title: 'Feedback logger',
      icon: <FaChartLine className='w-4 h-4' />,
      href: '/trainer/feedback'
    }
    // {
    //   id: 'settings',
    //   title: 'Cài đặt',
    //   icon: <IoIosSettings className='w-4 h-4' />,
    //   href: '#'
    // }
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
        title='CodingLab'
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Sidebar - sẽ tự động fixed trên cả desktop và mobile */}
      <Sidebar
        items={sidebarItems}
        user={sampleUser}
        onMobileMenuToggle={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        onCollapsedChange={handleSidebarToggle}
        role='admin'
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
