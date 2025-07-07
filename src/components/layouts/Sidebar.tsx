import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { SidebarContext } from '@/hooks/use-sidebar2'
import { cn } from '@/lib/utils'
import React, { useState, useEffect } from 'react'
import { MdChevronLeft, MdChevronRight, MdLogout } from 'react-icons/md'
import SidebarMenuItem from './SidebarItem'
import { useNavigate } from 'react-router'
import type { UserResponse } from '@/types/auth'
import { useAppSelector } from '@/app/hook'

export interface SidebarItem {
  id: string
  title: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  children?: SidebarItem[]
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
  onMobileMenuToggle?: (isOpen: boolean) => void
  isMobileMenuOpen?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  role: 'user' | 'admin' | 'trainer'
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  className,
  onMobileMenuToggle,
  isMobileMenuOpen,
  onCollapsedChange,
  role
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const user = useAppSelector((state) => state.auth.user) as UserResponse | null
  const navigate = useNavigate()

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  const toggleCollapsed = () => {
    if (isMobile) {
      onMobileMenuToggle?.(!isMobileMenuOpen)
    } else {
      const newCollapsed = !collapsed
      setCollapsed(newCollapsed)
      onCollapsedChange?.(newCollapsed)
    }
  }

  const closeMobileMenu = () => {
    if (isMobile) {
      onMobileMenuToggle?.(false)
    }
  }

  useEffect(() => {
    if (!isMobile) {
      setCollapsed(false)
    }
  }, [isMobile])

  // Nhóm items theo category
  const accountItems = items.filter((item) => ['profile', 'settings'].includes(item.id))
  const otherItems = items.filter((item) => !['profile', 'settings'].includes(item.id))

  const handleLogout = () => {
    navigate('/signout')
  }

  // Get background colors based on role
  const getRoleColors = () => {
    switch (role) {
      case 'admin':
        return {
          background: 'bg-cyan-900',
          border: 'border-cyan-700',
          accent: 'hover:bg-cyan-800'
        }
      case 'trainer':
        return {
          background: 'bg-green-900',
          border: 'border-green-700',
          accent: 'hover:bg-green-800'
        }
      case 'user':
      default:
        return {
          background: 'bg-slate-900',
          border: 'border-slate-700',
          accent: 'hover:bg-slate-700'
        }
    }
  }

  const roleColors = getRoleColors()
  return (
    <>
      {' '}
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden`} onClick={closeMobileMenu} />
      )}
      <SidebarContext.Provider value={{ collapsed: isMobile ? false : collapsed, toggleCollapsed }}>
        <div
          className={cn(
            'flex flex-col text-white transition-all duration-300 h-screen',
            roleColors.background,
            // Desktop styles - fixed position
            !isMobile && 'fixed left-0 top-0 z-30',
            !isMobile && (collapsed ? 'w-16' : 'w-64'),
            // Mobile styles - completely hidden when closed
            isMobile && 'fixed inset-y-0 left-0 z-40 w-64',
            isMobile && (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'),
            className
          )}
        >
          {/* Header - only show on desktop */}
          {!isMobile && (
            <div className={`p-4 border-b flex-shrink-0 ${roleColors.border}`}>
              <div className='flex items-center justify-between'>
                {/* Only show logo on desktop when not collapsed */}
                {!collapsed && (
                  <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>CK</span>
                    </div>
                    <span className='font-semibold'>AgentCK</span>
                  </div>
                )}

                {/* Toggle button for desktop only */}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={toggleCollapsed}
                  className={`text-white cursor-pointer ${roleColors.accent}`}
                >
                  {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
                </Button>
              </div>
            </div>
          )}{' '}
          {/* Menu Content */}
          <ScrollArea
            className={cn(
              'flex-1 px-3 py-4 overflow-hidden',
              isMobile && 'pt-16' // Add padding-top on mobile to account for fixed header
            )}
          >
            <div className='flex flex-col h-full'>
              {/* Top Section - Main Menu & General */}
              <div className='space-y-6 flex-1 pb-3'>
                {' '}
                {/* Main Menu */}
                {otherItems.length > 0 && (
                  <div className='space-y-2'>
                    {!(isMobile ? false : collapsed) && (
                      // <h3 className='text-xs font-semibold text-slate-400 uppercase tracking-wide px-3'>Main Menu</h3>
                      <div className='px-3' />
                    )}
                    {otherItems.map((item) => (
                      <SidebarMenuItem
                        key={item.id}
                        item={{ ...item, onClick: isMobile ? toggleCollapsed : () => {} }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Section - Account Items */}
              <div className='mt-auto space-y-2'>
                {' '}
                {/* Account */}
                {accountItems.length > 0 && (
                  <>
                    {!(isMobile ? false : collapsed) && (
                      <Separator className={roleColors.border.replace('border-', 'bg-')} />
                    )}
                    {!(isMobile ? false : collapsed) && (
                      <h3 className='text-xs font-semibold text-slate-400 uppercase tracking-wide px-3'>Account</h3>
                    )}
                    {accountItems.map((item) => (
                      <SidebarMenuItem key={item.id} item={item} />
                    ))}
                  </>
                )}
              </div>
            </div>
          </ScrollArea>{' '}
          {/* User Profile */}
          {user && (
            <div className={`p-4 border-t flex-shrink-0 ${roleColors.border}`}>
              {(isMobile ? false : collapsed) ? (
                <div className='flex justify-center'>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className='flex items-center space-x-3'>
                  <Avatar className='w-10 h-10'>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{user.zalo_name || user.full_name}</p>
                    <p className='text-xs text-slate-400 truncate'>{user.role}</p>
                  </div>
                </div>
              )}
            </div>
          )}{' '}
          {/* Logout Button - Moved to bottom */}
          <div className={`p-4 border-t flex-shrink-0 ${roleColors.border}`}>
            {(isMobile ? false : collapsed) ? (
              <div className='relative group'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='w-full h-10 justify-center text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer'
                  onClick={handleLogout}
                >
                  <MdLogout className='w-4 h-4' />
                </Button>
                <div className='absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap'>
                  Đăng xuất
                </div>
              </div>
            ) : (
              <Button
                variant='ghost'
                className='w-full justify-start h-10 px-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer'
                onClick={handleLogout}
              >
                <MdLogout className='mr-2 w-4 h-4' />
                <span className='flex-1 text-left'>Đăng xuất</span>
              </Button>
            )}
          </div>{' '}
        </div>
      </SidebarContext.Provider>
    </>
  )
}

export default Sidebar
