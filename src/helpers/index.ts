import { options } from '@/constants'

export * from './app'
export * from './forms'
export * from './addressValidation'
export * from './verificationDigit'

/**
 * Determines the view type based on the given width.
 * @param width - The width of the viewport.
 * @returns The view type ('Mobile', 'Tab', or 'Desktop').
 */
export const getView = (width: number): 'Desktop' | 'Mobile' | 'Tab' => {
  let newView: 'Desktop' | 'Mobile' | 'Tab' = 'Mobile'

  if (width > 1220) {
    newView = 'Desktop'
  } else if (width > 767) {
    newView = 'Tab'
  }

  return newView
}

export const isServer = typeof window === 'undefined'

export const getDefaultPath = (): string[] => {
  const getParent = (lastRoute: string | undefined): string[] => {
    const parent: string[] = []
    if (lastRoute !== '') return parent
    parent.push(lastRoute)
    options.forEach((option) => {
      if (option.children !== undefined) {
        option.children.forEach((child) => {
          if (child.key === lastRoute) {
            parent.push(option.key)
          }
        })
      }
    })
    return parent
  }

  if (!isServer && window.location.pathname !== '') {
    const routes = window.location.pathname.split('/')
    if (routes.length > 1) {
      const lastRoute = routes[routes.length - 1]
      return getParent(lastRoute)
    }
  }
  return []
}
