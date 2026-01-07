import { batch } from '@preact/signals-react'

import { AppState } from '@/state'

export const appStateActions = {
  changeCurrent: (currentKeys: string[]) => {
    AppState.current.value = currentKeys
  },
  changeOpenKeys: (currentOpenKeys: string[]) => {
    AppState.openKeys.value = currentOpenKeys
  },
  clearMenu: () => {
    batch(() => {
      AppState.openKeys.value = []
      AppState.current.value = []
    })
  },
  collapseChange: () => {
    AppState.collapsed.value = !AppState.collapsed.peek()
  },
  collapseOpenDrawer: () => {
    AppState.openDrawer.value = !AppState.openDrawer.peek()
  },
  collapseSidebar: () => {
    AppState.collapsed.value = true
  },
  toggleAll: (options: {
    collapsed: boolean
    height: number
    view: 'Mobile' | 'Desktop' | 'Tab'
  }) => {
    if (
      AppState.view.peek() !== options.view ||
      AppState.height.peek() !== options.height
    ) {
      const newHeight = options.height ?? AppState.height.peek()

      batch(() => {
        AppState.collapsed.value = options.collapsed
        AppState.height.value = newHeight
        AppState.view.value = options.view
      })
    }
  },
  uncollapseSidebar: () => {
    AppState.collapsed.value = false
  },
}
