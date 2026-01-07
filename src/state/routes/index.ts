/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  type IRoute,
  type IRoutePagination,
  type IRoutesState,
} from '@/interfaces'

const routes: Signal<IRoute[]> = signal([])
const currentRoute: Signal<IRoute> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<IRoutePagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})

export const RoutesState: IRoutesState = {
  currentRoute,
  openDrawer,
  pagination,
  routes,
}
