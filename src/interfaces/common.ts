export interface HOCProps {
  t?: Function
}
export interface ModelBase {
  createdAt?: string
  createdBy?: number
  id?: number
  maskedUId?: string
  uid?: string
  updatedAt?: string
  updatedBy?: number
}

export interface IPagination {
  page: number
  pageSize: number
  pageSizeOptions: number[]
  total: number
}
