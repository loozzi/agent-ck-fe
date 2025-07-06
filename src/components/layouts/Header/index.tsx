import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, TrendingUp, BookOpen, BarChart3, Info, User, Menu, X } from 'lucide-react'
import './Header.css'

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleDropdownToggle = (dropdown: string) => {
    // Handle news section scroll separately
    if (dropdown === 'news') {
      const newsSection = document.getElementById('news-section')
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

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
      submenu: [
        { title: 'Khóa học cơ bản', path: '/education/basic' },
        { title: 'Khóa học nâng cao', path: '/education/advanced' },
        { title: 'Webinar', path: '/education/webinar' },
        { title: 'Chứng chỉ', path: '/education/certification' }
      ]
    }
  ]

  const rightNavItems = [
    {
      id: 'analysis',
      title: 'Phân tích & Đầu tư CK',
      icon: <BarChart3 size={16} />,
      submenu: [
        { title: 'Phân tích kỹ thuật', path: '/analysis/technical' },
        { title: 'Phân tích cơ bản', path: '/analysis/fundamental' },
        { title: 'Danh mục đầu tư', path: '/portfolio' },
        { title: 'Công cụ giao dịch', path: '/trading-tools' }
      ]
    },
    {
      id: 'info',
      title: 'Thông tin đầu tư',
      icon: <Info size={16} />,
      submenu: [
        { title: 'Thông tin công ty', path: '/info/companies' },
        { title: 'Lịch sự kiện', path: '/info/events' },
        { title: 'Chỉ số thị trường', path: '/info/indices' },
        { title: 'Hỗ trợ', path: '/info/support' }
      ]
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
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm'
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {!item.isScrollTarget && (
                      <ChevronDown
                        size={14}
                        className={`transform transition-transform duration-200 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {activeDropdown === item.id && item.submenu && item.submenu.length > 0 && (
                    <div className='absolute top-full left-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-blue-100 z-50 dropdown-minimal'>
                      <div className='py-1'>
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className='block px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150'
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.title}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
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
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm'
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronDown
                      size={14}
                      className={`transform transition-transform duration-200 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === item.id && (
                    <div className='absolute top-full right-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-blue-100 z-50 dropdown-minimal'>
                      <div className='py-1'>
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className='block px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150'
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.title}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* User Profile */}
              <div className='relative'>
                <button
                  onClick={() => handleDropdownToggle('user')}
                  className='flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200'
                >
                  <User size={16} />
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform duration-200 ${
                      activeDropdown === 'user' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === 'user' && (
                  <div className='absolute top-full right-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-blue-100 z-50 dropdown-minimal'>
                    <div className='py-1'>
                      <NavLink
                        to='/dashboard'
                        className='block px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150'
                        onClick={() => setActiveDropdown(null)}
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to='/profile'
                        className='block px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150'
                        onClick={() => setActiveDropdown(null)}
                      >
                        Hồ sơ
                      </NavLink>
                      <NavLink
                        to='/settings'
                        className='block px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150'
                        onClick={() => setActiveDropdown(null)}
                      >
                        Cài đặt
                      </NavLink>
                      <hr className='my-1' />
                      <NavLink
                        to='/signin'
                        className='block px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150'
                        onClick={() => setActiveDropdown(null)}
                      >
                        Đăng nhập
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-white border-t border-blue-200'>
            <div className='px-4 py-2 space-y-1'>
              {[...navItems, ...rightNavItems].map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className='flex items-center justify-between w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200'
                  >
                    <div className='flex items-center space-x-2'>
                      {item.icon}
                      <span className='text-sm'>{item.title}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`transform transition-transform duration-200 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === item.id && (
                    <div className='mt-1 ml-4 space-y-1'>
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className='block px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150'
                          onClick={() => {
                            setActiveDropdown(null)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          {subItem.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
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
