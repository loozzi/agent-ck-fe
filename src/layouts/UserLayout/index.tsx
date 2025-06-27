import { useAppSelector } from '@/app/hook'
import MobileHeader from '@/components/layouts/MobileHeader'
import Sidebar from '@/components/layouts/Sidebar'
import SidebarProvider from '@/components/layouts/SidebarProvider'
import UserNavigator from '@/navigators/user.routes'
import { useState } from 'react'
import { FaBookOpen, FaChartLine, FaHome, FaWallet } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const user = useAppSelector((state) => state.auth.user)

  const sidebarItems: any[] = [
    {
      id: 'dashboard',
      title: 'Bảng điều khiển',
      icon: <FaHome className='w-4 h-4' />,
      href: '/'
    },
    {
      id: 'history',
      title: 'Lịch sử',
      icon: <FaChartLine className='w-4 h-4' />,
      href: '/transaction-history'
    },
    {
      id: 'learning',
      title: 'Học tập',
      icon: <FaBookOpen className='w-4 h-4' />,
      href: '/learning'
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
  const sampleUser = {
    name: user?.full_name || 'User Name',
    role: user?.role || 'Viewer',
    avatar: '/avatars/eva-murphy.jpg'
  }

  return (
    <SidebarProvider>
      <MobileHeader
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        title='CodingLab'
        isMenuOpen={isMobileMenuOpen}
      />

      <Sidebar
        items={sidebarItems}
        user={sampleUser}
        onMobileMenuToggle={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main className='flex-1 md:ml-0 p-4 md:mt-0 mt-16'>
        <UserNavigator />
      </main>
    </SidebarProvider>
  )
}

export default UserLayout
