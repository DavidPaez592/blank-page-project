import { useComputed, type Signal } from '@preact/signals-react'
import { useCallback } from 'react'

import { useApp } from '@/hooks/useApp'
import { type IMenuItem, type TAuthCurrentUserState } from '@/interfaces'
import { AppState } from '@/state'
import { AuthState } from '@/state/auth'

interface SidebarProps {
  collapseSidebar: () => void
  current: Signal<string[]>
  isCollapsed: boolean
  menu: Signal<IMenuItem[]>
  mode: 'vertical' | 'inline'
  onMouseEnter: () => void
  onMouseLeave: () => void
  onOpenChange: (newOpenKeys: string[]) => void
  openKeys: Signal<string[]>
  setCurrent: (key: string[]) => void
  uncollapseSidebar: () => void
  user: Signal<TAuthCurrentUserState>
}

const { currentUser, menu } = AuthState

export const useSidebar = (): SidebarProps => {
  const { collapsed, current, openDrawer, openKeys } = AppState

  const {
    handleChangeCurrent,
    handleChangeOpenKeys,
    handleCollapseOpenDrawer,
    handleCollapseSidebar,
    handleUncollapseSidebar,
    view,
  } = useApp()

  const setCurrent = useCallback((key: string[]): void => {
    handleChangeCurrent(key)
  }, [])

  const onOpenChange = useCallback(
    (newOpenKeys: string[]): void => {
      const latestOpenKey = newOpenKeys.find(
        (key) => !openKeys.peek().includes(key)
      )
      const latestCloseKey = openKeys
        .peek()
        .find((key) => !newOpenKeys.includes(key))
      let nextOpenKeys: string[] = []

      if (latestOpenKey != null) {
        nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
      }

      if (latestCloseKey != null) {
        nextOpenKeys = getAncestorKeys(latestCloseKey)
      }

      handleChangeOpenKeys(nextOpenKeys)
    },
    [openKeys, handleChangeOpenKeys]
  )

  const getAncestorKeys = (key: string): string[] => {
    const map: Record<string, string[]> = {
      sub3: ['sub2'],
    }

    return map[key] ?? []
  }

  const isCollapsed = useComputed(() => {
    return collapsed.value && !openDrawer.value && view.value !== 'Desktop'
  }).value

  const mode = isCollapsed ? 'vertical' : 'inline'

  const onMouseEnter = useCallback((): void => {
    if (collapsed.peek() && !openDrawer.peek()) {
      handleCollapseOpenDrawer()
    }
  }, [collapsed, openDrawer, handleCollapseOpenDrawer])

  const onMouseLeave = useCallback((): void => {
    if (collapsed.peek() && openDrawer.peek()) {
      handleCollapseOpenDrawer()
    }
  }, [collapsed, openDrawer, handleCollapseOpenDrawer])

  const collapseSidebar = useCallback((): void => {
    handleCollapseSidebar()
  }, [handleCollapseSidebar])

  const uncollapseSidebar = useCallback((): void => {
    handleUncollapseSidebar()
  }, [handleUncollapseSidebar])

  return {
    collapseSidebar,
    current,
    isCollapsed,
    menu,
    mode,
    onMouseEnter,
    onMouseLeave,
    onOpenChange,
    openKeys,
    setCurrent,
    uncollapseSidebar,
    user: currentUser,
  }
}
