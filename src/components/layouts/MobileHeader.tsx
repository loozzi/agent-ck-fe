import React from 'react'
import { Button } from '@/components/ui/button'
import { MdMenu, MdClose } from 'react-icons/md'
import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'

interface MobileHeaderProps {
  onMenuClick: () => void
  title?: string
  logo?: React.ReactNode
  className?: string
  isMenuOpen?: boolean
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  title = 'CodingLab',
  logo,
  className,
  isMenuOpen = false
}) => {
  return (
    <header
      className={cn(
        'md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-lg fixed top-0 left-0 right-0 z-50',
        className
      )}
    >
      {/* Menu Button */}
      <Button variant='ghost' size='icon' onClick={onMenuClick} className='text-white hover:bg-slate-700'>
        {isMenuOpen ? <MdClose className='w-5 h-5' /> : <MdMenu className='w-5 h-5' />}
      </Button>

      {/* Logo & Title */}
      <NavLink to={'/'} className='flex items-center space-x-2'>
        {logo || (
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>CL</span>
          </div>
        )}
        <span className='font-semibold text-lg'>{title}</span>
      </NavLink>

      {/* Right side placeholder (for potential actions) */}
      <div className='w-10'></div>
    </header>
  )
}

export default MobileHeader
