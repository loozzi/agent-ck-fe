import { createContext, useContext } from 'react'

export const SidebarContext = createContext<{
  collapsed: boolean
  toggleCollapsed: () => void
}>({
  collapsed: false,
  toggleCollapsed: () => {}
})

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
