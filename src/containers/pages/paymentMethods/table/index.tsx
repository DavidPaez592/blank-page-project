import { FloatButton, Table } from 'antd'
import { IoAddCircle } from 'react-icons/io5'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useApp } from '@/hooks/useApp'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { PaymentMethodsState } from '@/state'
import { paymentMethodsStateActions } from '@/state/paymentMethods/actions'
import { PaymentMethodsTableColumns } from './config'

/**
 * PaymentMethodsTable component
 *
 * This component displays a table of payment methods. It includes a floating button for creating new payment methods
 * and handles pagination, loading state, and access permissions.
 *
 * @returns {JSX.Element} The rendered component
 */
export const PaymentMethodsTable: React.FC = (): JSX.Element => {
  const { loading } = usePaymentMethods()
  const { currentPage, pageSize, total, paginatedPaymentMethods } =
    PaymentMethodsState
  const { view } = useApp()

  const pageSizeOptions = ['10', '20', '50', '100']

  return (
    <>
      <CheckAccess
        permission={PERMISSIONS_LIST.PaymentMethodsList}
        message='No tienes acceso a la lista de métodos de pago'
      >
        <Table
          size='small'
          loading={loading.value.list}
          dataSource={paginatedPaymentMethods.value}
          pagination={{
            position: ['bottomCenter'],
            onChange: (page, size) =>
              paymentMethodsStateActions.changePagination(page, size),
            pageSizeOptions,
            pageSize: pageSize.value,
            current: currentPage.value,
            showSizeChanger: true,
            total: total.value,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} métodos de pago`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={PaymentMethodsTableColumns}
          scroll={{ x: 'max-content', y: 'calc(100dvh - 132px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}

export default PaymentMethodsTable
