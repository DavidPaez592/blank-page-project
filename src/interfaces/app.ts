import { type Signal } from '@preact/signals-react'

export interface TAppState {
  collapsed: Signal<boolean>
  current: Signal<string[]>
  height: Signal<number>
  openDrawer: Signal<boolean>
  openKeys: Signal<string[]>
  view: Signal<'Desktop' | 'Mobile' | 'Tab'>
}
