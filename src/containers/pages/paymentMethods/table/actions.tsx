import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { IPaymentMethod } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

interface PaymentMethodsTableActionsProps {
  paymentMethodData: IPaymentMethod
}

export default function PaymentMethodsTableActions({
  paymentMethodData,
}: PaymentMethodsTableActionsProps) {
  const { loading, handleEditPaymentMethod, handleDeletePaymentMethod } =
    usePaymentMethods()

  const handleEdit = () => {
    handleEditPaymentMethod(paymentMethodData)
  }

  const handleDelete = () => {
    handleDeletePaymentMethod(paymentMethodData.uid)
  }

  return (
    <Space size='middle' align='center'>
      {/* Edit Payment Method */}
      <CheckAccess permission={PERMISSIONS_LIST.PaymentMethodsUpdate}>
        <Tooltip title='Editar'>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleEdit}
            loading={loading.value.update}
            disabled={loading.value.update}
            size='middle'
            icon={
              <MdEditSquare
                title='Editar'
                size={20}
                color='grey'
                cursor='pointer'
              />
            }
          />
        </Tooltip>
      </CheckAccess>

      {/* Delete Payment Method */}
      <CheckAccess permission={PERMISSIONS_LIST.PaymentMethodsDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar este método de pago?'
            description='Esta acción no se puede deshacer.'
            okText='Sí, eliminar'
            cancelText='No, cancelar'
            placement='left'
            onConfirm={handleDelete}
            okButtonProps={{
              disabled: loading.value.delete,
              loading: loading.value.delete,
              danger: true,
            }}
          >
            <Button
              style={{ borderRadius: '50%', padding: '5px' }}
              icon={
                <MdDeleteForever
                  title='Eliminar'
                  size={20}
                  color='red'
                  cursor='pointer'
                />
              }
            />
          </Popconfirm>
        </Tooltip>
      </CheckAccess>
    </Space>
  )
}
