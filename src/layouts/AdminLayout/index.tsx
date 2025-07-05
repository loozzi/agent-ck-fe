import { useAppSelector } from '@/app/hook'
import MobileHeader from '@/components/layouts/MobileHeader'
import Sidebar from '@/components/layouts/Sidebar'
import SidebarProvider from '@/components/layouts/SidebarProvider'
import ChatAssistantButton from '@/components/common/ChatAssistantButton'
import AdminNavigator from '@/navigators/admin.routes'
import { useEffect, useState } from 'react'
import { FaHome, FaUsers, FaWallet } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
import type { RouteItem } from '../UserLayout'
const AdminLayout = () => {
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
      title: 'Bảng điều khiển',
      icon: <FaHome className='w-4 h-4' />,
      href: '/admin/dashboard'
    },
    {
      id: 'user-management',
      title: 'Quản lý người dùng',
      icon: <FaUsers className='w-4 h-4' />,
      href: '/admin/user-management'
    },
    {
      id: 'subscription',
      title: 'Quản lý code',
      icon: <FaWallet className='w-4 h-4' />,
      href: '/admin/subscription'
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: <IoIosSettings className='w-4 h-4' />,
      href: '/admin/setting'
    }
  ]

  const sampleUser = {
    name: user?.full_name || 'User Name',
    role: user?.role || 'Viewer',
    avatar: '/avatars/eva-murphy.jpg'
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
          <AdminNavigator />
        </div>
      </main>

      {/* Chat Assistant Button - Fixed floating button */}
      <ChatAssistantButton />
    </SidebarProvider>
  )
}

export default AdminLayout
