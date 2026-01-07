// import { Table } from 'antd'
// import { CheckAccess } from '@/components/checkAccess'
// import { PERMISSIONS_LIST } from '@/constants'
// import { useCurrencies } from '@/hooks/useCurrencies'
// import { CurrenciesState } from '@/state'
// import { currenciesStateActions } from '@/state/currencies/actions'
// import { CurrenciesTableColumns } from './config'

// /**
//  * CurrenciesTable component
//  *
//  * This component displays a table of currencies. It includes a floating button for creating new currencies
//  * and handles pagination, loading state, and access permissions.
//  *
//  * @returns {JSX.Element} The rendered component
//  */
// export const CurrenciesTable: React.FC = (): JSX.Element => {
//   const { loading } = useCurrencies()
//   const { currentPage, pageSize, total, paginatedCurrencies } = CurrenciesState
//   const pageSizeOptions = ['10', '20', '50', '100']

//   return (
//     <>
//       <CheckAccess
//         permission={PERMISSIONS_LIST.CurrenciesList}
//         message='No tienes acceso a la lista de monedas'
//       >
//         <Table
//           size='small'
//           loading={loading.value.list}
//           dataSource={paginatedCurrencies.value}
//           pagination={{
//             position: ['bottomCenter'],
//             onChange: (page, size) =>
//               currenciesStateActions.changePagination(page, size),
//             pageSizeOptions,
//             pageSize: pageSize.value,
//             current: currentPage.value,
//             showSizeChanger: true,
//             total: total.value,
//             showTotal(total, range) {
//               return `${range[0]} - ${range[1]} de ${total} monedas`
//             },
//             responsive: true,
//             size: 'default',
//             locale: { items_per_page: 'por página' },
//           }}
//           columns={CurrenciesTableColumns}
//           scroll={{ x: 'max-content', y: 'calc(100dvh - 132px)' }}
//           bordered
//           sticky={true}
//         />
//       </CheckAccess>
//     </>
//   )
// }

// export default CurrenciesTable

import { useEffect, useState } from 'react'
import { Table, message } from 'antd'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import currenciesRequests from '@/state/currencies/requests'
import { CurrenciesTableColumns } from './config'
import type { ICurrency } from '@/interfaces'

export const CurrenciesTable = () => {
  const [data, setData] = useState<ICurrency[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  /**
   * Fetch currencies from API
   */
  const fetchCurrencies = async (page: number, limit: number) => {
    try {
      setLoading(true)

      const { data } = await currenciesRequests.getPaginated({
        page,
        limit,
      })

      setData(data.currencies)
      setTotal(data.total)
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || 'Error al cargar las monedas'
      )
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initial load (runs once)
   */
  useEffect(() => {
    fetchCurrencies(page, pageSize)
  }, [])

  /**
   * Pagination handler
   */
  const handleChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
    fetchCurrencies(newPage, newPageSize)
  }

  return (
    <CheckAccess
      permission={PERMISSIONS_LIST.CurrenciesList}
      message='No tienes acceso a la lista de monedas'
    >
      <Table
        rowKey='uid'
        size='small'
        loading={loading}
        dataSource={data}
        columns={CurrenciesTableColumns}
        bordered
        sticky
        scroll={{ x: 'max-content', y: 'calc(100dvh - 132px)' }}
        pagination={{
          position: ['bottomCenter'],
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          locale: { items_per_page: 'por página' },
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} de ${total} monedas`,
          onChange: handleChange,
        }}
      />
    </CheckAccess>
  )
}

export default CurrenciesTable
