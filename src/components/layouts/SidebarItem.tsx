import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/use-sidebar2'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { MdChevronRight } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

export interface SidebarItem {
  id: string
  title: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  children?: SidebarItem[]
  badge?: string | number
}

const SidebarMenuItem: React.FC<{ item: SidebarItem; level?: number }> = ({ item, level = 0 }) => {
  const { collapsed } = useSidebar()
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded)
    } else if (item.onClick) {
      item.onClick()
    }
    // Note: Navigation will be handled by NavLink when href is provided
  }
  if (collapsed) {
    return (
      <div className='relative group'>
        {item.href ? (
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              cn(
                'w-full h-10 justify-center cursor-pointer inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                level > 0 && 'ml-2',
                isActive && 'bg-accent text-accent-foreground'
              )
            }
            onClick={item.onClick}
          >
            {item.icon}
          </NavLink>
        ) : (
          <Button
            variant='ghost'
            size='icon'
            className={cn('w-full h-10 justify-center cursor-pointer', level > 0 && 'ml-2')}
            onClick={handleClick}
          >
            {item.icon}
          </Button>
        )}
        {/* Tooltip khi collapsed */}
        <div className='absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap'>
          {item.title}
        </div>
      </div>
    )
  }
  return (
    <div className='space-y-1'>
      {item.href ? (
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            cn(
              'w-full justify-start h-10 px-3 cursor-pointer inline-flex items-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              level > 0 && 'ml-4 w-[calc(100%-1rem)]',
              isActive && 'bg-accent text-accent-foreground'
            )
          }
          onClick={item.onClick}
        >
          <span className='mr-2'>{item.icon}</span>
          <span className='flex-1 text-left'>{item.title}</span>
          {item.badge && (
            <span className='ml-auto bg-primary/20 text-primary px-1.5 py-0.5 text-xs rounded'>{item.badge}</span>
          )}
        </NavLink>
      ) : (
        <Button
          variant='ghost'
          className={cn('w-full justify-start h-10 px-3 cursor-pointer', level > 0 && 'ml-4 w-[calc(100%-1rem)]')}
          onClick={handleClick}
        >
          <span className='mr-2'>{item.icon}</span>
          <span className='flex-1 text-left'>{item.title}</span>
          {item.badge && (
            <span className='ml-auto bg-primary/20 text-primary px-1.5 py-0.5 text-xs rounded'>{item.badge}</span>
          )}
          {hasChildren && (
            <MdChevronRight className={cn('ml-auto h-4 w-4 transition-transform', expanded && 'rotate-90')} />
          )}
        </Button>
      )}

      {hasChildren && expanded && (
        <div className='space-y-1'>
          {item.children?.map((child) => (
            <SidebarMenuItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarMenuItem
