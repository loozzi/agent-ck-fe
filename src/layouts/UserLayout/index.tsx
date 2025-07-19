import ChatAssistantButton from '@/components/common/ChatAssistantButton'
import MobileHeader from '@/components/layouts/MobileHeader'
import Sidebar from '@/components/layouts/Sidebar'
import SidebarProvider from '@/components/layouts/SidebarProvider'
import UserNavigator from '@/navigators/user.routes'
import { useEffect, useState, type JSX } from 'react'
import { FaBookOpen, FaBookReader, FaHome, FaRobot, FaWallet } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'

export interface RouteItem {
  id: string
  title: string
  icon: JSX.Element
  href: string
}

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

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
      href: '/dashboard'
    },
    {
      id: 'portfolio',
      title: 'Ví của tôi',
      icon: <FaWallet className='w-4 h-4' />,
      href: '/portfolio'
    },
    // {
    //   id: 'strategy',
    //   title: 'Chiến lược',
    //   icon: <FaBookReader className='w-4 h-4' />,
    //   href: '/strategy'
    // },
    {
      id: 'learning',
      title: 'Học tập',
      icon: <FaBookOpen className='w-4 h-4' />,
      href: '/learning'
    },
    {
      id: 'chat',
      title: 'Trợ lý AI',
      icon: <FaRobot className='w-4 h-4' />,
      href: '/chat'
    },
    {
      id: 'subscription',
      title: 'Gói dịch vụ',
      icon: <FaWallet className='w-4 h-4' />,
      href: '/subscription'
    },
    // {
    //   id: 'projects',
    //   title: 'Projects',
    //   icon: <FaFolderOpen className='w-4 h-4' />,
    //   badge: '12',
    //   children: [
    //     {
    //       id: 'my-projects',
    //       title: 'My Projects',
    //       icon: <FaFolderOpen className='w-4 h-4' />,
    //       href: '/projects/my'
    //     },
    //     {
    //       id: 'shared-projects',
    //       title: 'Shared Projects',
    //       icon: <FaUsers className='w-4 h-4' />,
    //       href: '/projects/shared'
    //     }
    //   ]
    // },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: <IoIosSettings className='w-4 h-4' />,
      href: '/setting'
    }
  ]

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
        onMobileMenuToggle={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        onCollapsedChange={handleSidebarToggle}
        role='user'
      />

      {/* Main Content - với margin động theo trạng thái sidebar */}
      <main
        className={`flex-1 overflow-auto mt-16 md:mt-0 transition-all duration-300 ease-in-out ${getMainContentMargin()}`}
      >
        <div className='p-4 h-full'>
          <UserNavigator />
        </div>
      </main>

      {/* Chat Assistant Button - Fixed floating button */}
      <ChatAssistantButton />
      <div
        className='fixed bottom-20 right-4 z-50'
        dangerouslySetInnerHTML={{
          __html: `<div class="zalo-follow-only-button" data-oaid="4412053929170802954"></div>`
        }}
      />
    </SidebarProvider>
  )
}

export default UserLayout
