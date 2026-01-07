import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useLocations } from '@/hooks/useLocations'
import { ILocation } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

export default function LocationTableActions({
  locationData,
}: {
  locationData: ILocation
}) {
  const { handleEditLocation, handleDeleteLocation, loading } = useLocations()

  const handleEdit = () => {
    handleEditLocation(locationData.uid as string)
  }

  const handleDelete = () => {
    handleDeleteLocation(locationData.uid as string)
  }

  const canModify = locationData.modifiable !== false
  const canDelete = locationData.deletable !== false

  return (
    <Space size='middle' align='center'>
      {canModify && (
        <CheckAccess permission={PERMISSIONS_LIST.LocationsUpdate}>
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
      )}
      {canDelete && (
        <CheckAccess permission={PERMISSIONS_LIST.LocationsDelete}>
          <Tooltip placement='right' title='Eliminar'>
            <Popconfirm
              title='¿Eliminar esta ubicación?'
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
      )}
    </Space>
  )
}
