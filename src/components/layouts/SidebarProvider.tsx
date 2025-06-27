import React from 'react'

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-background'>
      {/* Sidebar sẽ được fixed và content sẽ có margin để tránh overlap */}
      {children}
    </div>
  )
}

export default SidebarProvider
