import React from 'react'

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  return <div className='flex h-full w-full'>{children}</div>
}

export default SidebarProvider
