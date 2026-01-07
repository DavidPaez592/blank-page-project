import { useEffect, useState } from 'react'
import axiosInstance from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

export const useGetOfficesList = (refresh = 0, page = 1, limit = 10) => {
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get('/offices', { headers: getTenantHeaders(), params: { page, limit } })
      .then((res) => {
        const d = res.data?.data || {}
        setData(d.offices || [])
        setPagination({
          total: d.total || 0,
          current: d.page || 1,
          pageSize: d.limit || 10,
        })
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [refresh, page, limit])

  return { data, pagination, loading, error }
}
