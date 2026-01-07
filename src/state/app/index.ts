/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import { getDefaultPath, getView, isServer } from '@/helpers'
import { type TAppState } from '@/interfaces/app'

const collapsed: Signal<boolean> = signal(!isServer && window.innerWidth < 1220)

const preKeys = getDefaultPath()
const current: Signal<string[]> = signal(preKeys)

const height: Signal<number> = signal(!isServer ? window.innerHeight : 0)

const openDrawer: Signal<boolean> = signal(false)

const openKeys: Signal<string[]> = signal([])

const view: Signal<'Desktop' | 'Mobile' | 'Tab'> = signal(
  !isServer
    ? (getView(window.innerWidth) as 'Desktop' | 'Mobile' | 'Tab')
    : 'Desktop'
)

export const AppState: TAppState = {
  collapsed,
  current,
  height,
  openDrawer,
  openKeys,
  view,
}
