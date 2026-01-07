import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect, useCallback } from 'react'

import { getView } from '@/helpers'
import { appStateActions } from '@/state/actions'

interface AppProps {
  handleChangeCurrent: (current: string[]) => void
  handleChangeOpenKeys: (openKeys: string[]) => void
  handleCollapseOpenDrawer: () => void
  handleCollapseSidebar: () => void
  handleToggleCollapsed: () => void
  handleUncollapseSidebar: () => void
  size: Signal<{
    height?: number
    width?: number
  }>
  view: Signal<'Desktop' | 'Mobile' | 'Tab'>
}

export const useApp = (): AppProps => {
  const isClient = typeof window === 'object'

  const getSize = useCallback(
    () => ({
      height: isClient ? window.innerHeight : undefined,
      width: isClient ? window.innerWidth : undefined,
    }),
    [isClient]
  )

  const size = useSignal(getSize())
  const view = useSignal(getView(window.innerWidth))

  useEffect(() => {
    /**
     * Its not necessary to subscribe to events if we are not on the client
     */
    if (!isClient) return

    const onHandleResize = (): void => {
      size.value = getSize()
      view.value = getView(window.innerWidth)
    }

    window.addEventListener('resize', onHandleResize)

    return () => {
      window.removeEventListener('resize', onHandleResize)
    }
  }, [getSize, isClient])

  const handleToggleCollapsed = (): void => {
    appStateActions.collapseChange()
  }

  const handleChangeCurrent = (current: string[]): void => {
    appStateActions.changeCurrent(current)
  }

  const handleChangeOpenKeys = (openKeys: string[]): void => {
    appStateActions.changeOpenKeys(openKeys)
  }

  const handleCollapseOpenDrawer = (): void => {
    appStateActions.collapseOpenDrawer()
  }

  const handleCollapseSidebar = (): void => {
    appStateActions.collapseSidebar()
  }

  const handleUncollapseSidebar = (): void => {
    appStateActions.uncollapseSidebar()
  }

  return {
    handleChangeCurrent,
    handleChangeOpenKeys,
    handleCollapseOpenDrawer,
    handleCollapseSidebar,
    handleToggleCollapsed,
    handleUncollapseSidebar,
    size,
    view,
  }
}
