export interface RouteBrowser {
  name: string
  route: string
  element: React.ReactNode
  exact?: boolean
  children?: RouteBrowser[]

  [key: string]: any
}
