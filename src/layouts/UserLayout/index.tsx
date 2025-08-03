import type { RootState } from '@/app/store'
import ChatAssistantButton from '@/components/common/ChatAssistantButton'
import ZaloFollowDialog from '@/components/common/ZaloFollowDialog'
import MobileHeader from '@/components/layouts/MobileHeader'
import Sidebar from '@/components/layouts/Sidebar'
import SidebarProvider from '@/components/layouts/SidebarProvider'
import UserNavigator from '@/navigators/user.routes'
import { checkZaloFollowStatus } from '@/slices/zalo.slice'
import { useEffect, useState, type JSX } from 'react'
import { FaBookOpen, FaHome, FaMoneyBillWave, FaRobot, FaWallet } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'

export interface RouteItem {
  id: string
  title: string
  icon: JSX.Element
  href: string
}

const UserLayout = () => {
  const dispatch = useDispatch()
  const { followStatus } = useSelector((state: RootState) => state.zalo)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [showZaloDialog, setShowZaloDialog] = useState<boolean>(false)

  // Check Zalo follow status on component mount
  useEffect(() => {
    dispatch(checkZaloFollowStatus() as any)
  }, [dispatch])

  // Monitor follow status and show dialog if not following
  useEffect(() => {
    if (followStatus) {
      // If user is not following, show the dialog
      if (!followStatus.is_follower) {
        setShowZaloDialog(true)
      } else {
        setShowZaloDialog(false)
      }
    }
    // Also check if there's an error in checking follow status
    // In case of error, we might want to show the dialog to be safe
  }, [followStatus])

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
      id: 'watchlist',
      title: 'Danh mục theo dõi',
      icon: <FaWallet className='w-4 h-4' />,
      href: '/watchlist'
    },
    // {
    //   id: 'portfolio',
    //   title: 'Ví của tôi',
    //   icon: <FaWallet className='w-4 h-4' />,
    //   href: '/portfolio'
    // },
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
      icon: <FaMoneyBillWave className='w-4 h-4' />,
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

      {/* Zalo Follow Dialog - Show when user hasn't followed */}
      <ZaloFollowDialog open={showZaloDialog} onOpenChange={setShowZaloDialog} />

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
