import { useAppSelector } from '@/app/hook'
import { BookOpen, Info, Menu, TrendingUp, User, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveDropdown(null)
  }

  const navItems = [
    {
      id: 'news',
      title: 'Tin tức CK',
      icon: <TrendingUp size={16} />,
      isScrollTarget: true, // Flag to indicate this is a scroll target
      submenu: [] // Empty submenu since we're scrolling instead
    },
    {
      id: 'education',
      title: 'Đào tạo CK',
      icon: <BookOpen size={16} />,
      submenu: []
    }
  ]

  const rightNavItems = [
    // Đã bỏ mục Phân tích & Đầu tư CK
    {
      id: 'info',
      title: 'Thông tin đầu tư',
      icon: <Info size={16} />,
      submenu: []
    }
  ]

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-50 bg-blue-600 border-b border-blue-700 shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-14'>
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className='md:hidden text-white hover:text-yellow-300 transition-colors duration-200'
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Left Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              {navItems.map((item) => (
                <div key={item.id} className='relative nav-item-minimal'>
                  <NavLink
                    to={item.id === 'education' ? '/learning' : '#'}
                    className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm'
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Logo */}
            <div className='flex-shrink-0'>
              <NavLink to='/' className='flex items-center space-x-2'>
                <div className='bg-blue-700 p-2 rounded-lg logo-minimal'>
                  <TrendingUp size={20} className='text-white' />
                </div>
                <span className='text-white font-bold text-lg'>CK Pro</span>
              </NavLink>
            </div>

            {/* Desktop Right Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              {rightNavItems.map((item) => (
                <div key={item.id} className='relative nav-item-minimal'>
                  <NavLink
                    to={item.id === 'info' ? '/watchlist' : '#'}
                    className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm'
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </div>
              ))}

              {/* User/Profile Button */}
              {(() => {
                const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated)
                return isLoggedIn ? (
                  <NavLink
                    to='/dashboard'
                    className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm px-3 py-2 rounded-md'
                  >
                    <User size={16} />
                    <span>Bảng điều khiển</span>
                  </NavLink>
                ) : (
                  <NavLink
                    to='/signin'
                    className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm px-3 py-2 rounded-md'
                  >
                    <User size={16} />
                    <span>Đăng nhập</span>
                  </NavLink>
                )
              })()}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-white border-t border-blue-200'>
            <div className='px-4 py-2 space-y-1'>
              {[...navItems, ...rightNavItems].map((item) => (
                <div key={item.id}>
                  <NavLink
                    to={item.id === 'education' ? '/learning' : item.id === 'info' ? '/watchlist' : '#'}
                    className='flex items-center justify-between w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200'
                    onClick={() => {
                      setActiveDropdown(null)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <div className='flex items-center space-x-2'>
                      {item.icon}
                      <span className='text-sm'>{item.title}</span>
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close dropdown when clicking outside */}
        {activeDropdown && <div className='fixed inset-0 z-40' onClick={() => setActiveDropdown(null)} />}
      </header>
    </>
  )
}

export default Header
