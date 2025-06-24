import UserNavigator from '@/navigators/user.routes'
import { FaBook, FaChartLine, FaHistory, FaWallet } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
const UserLayout = () => {
  // const sidebarItems: SidebarItem[] = [
  //   {
  //     title: 'Dashboard',
  //     url: '/user',
  //     icon: FaChartLine
  //   },
  //   {
  //     title: 'Learning',
  //     url: '/user/learning',
  //     icon: FaBook
  //   },
  //   {
  //     title: 'Payment',
  //     url: '/user/payment',
  //     icon: FaWallet
  //   },
  //   {
  //     title: 'Planning',
  //     url: '/user/planning',
  //     icon: FaWallet
  //   },
  //   {
  //     title: 'Setting',
  //     url: '/user/setting',
  //     icon: IoIosSettings
  //   },
  //   {
  //     title: 'History',
  //     url: '/user/transaction-history',
  //     icon: FaHistory
  //   }
  // ]

  return (
    <div>
      <nav>Sidebar</nav>
      <main>
        <UserNavigator />
      </main>
    </div>
  )
}

export default UserLayout
