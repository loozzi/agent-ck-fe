import React from 'react'
import { Button } from '@/components/ui/button'
import { MdMenu } from 'react-icons/md'
import { cn } from '@/lib/utils'

interface MobileMenuButtonProps {
  onClick: () => void
  className?: string
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick, className }) => {
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={onClick}
      className={cn(
        'md:hidden fixed top-4 left-4 z-60 bg-slate-900 text-white hover:bg-slate-700 shadow-lg',
        className
      )}
    >
      <MdMenu className='w-5 h-5' />
    </Button>
  )
}

export default MobileMenuButton
