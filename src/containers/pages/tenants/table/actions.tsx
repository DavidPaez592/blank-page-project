import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useTenant } from '@/hooks/useTenants'
import { ITenant } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdVisibility } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

export default function TenantTableActions({
  tenantData,
}: {
  tenantData: ITenant
}) {
  const { handleDeleteTenant, loading } = useTenant()
  const navigate = useNavigate()

  const handleDelete = () => {
    handleDeleteTenant(tenantData.uid as string)
  }

  const handleView = () => {
    navigate(`/tenants/${tenantData.uid}`)
  }

  return (
    <Space size='middle' align='center'>
      <CheckAccess permission={PERMISSIONS_LIST.TenantsDetail}>
        <Tooltip title='Ver detalle'>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleView}
            size='middle'
            icon={
              <MdVisibility
                title='Ver detalle'
                size={20}
                color='blue'
                cursor='pointer'
              />
            }
          />
        </Tooltip>
      </CheckAccess>
      <CheckAccess permission={PERMISSIONS_LIST.TenantsDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar esta empresa?'
            okText='Sí, eliminar'
            cancelText='No, cancelar'
            placement='left'
            onConfirm={handleDelete}
            okButtonProps={{
              disabled: loading.value.delete,
              loading: loading.value.delete,
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
