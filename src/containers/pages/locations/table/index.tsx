import { Table } from 'antd'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useLocations } from '@/hooks/useLocations'
import { LocationsTableColumns } from './config'

/**
 * LocationsTable component
 *
 * This component displays a table of locations and handles pagination and loading state.
 *
 * @returns {JSX.Element} The rendered component
 */
export const LocationsTable: React.FC = (): JSX.Element => {
  const { loading, pagination, handlePaginationChange } = useLocations()
  const { total, pageSize, page, pageSizeOptions, data } = pagination.value

  return (
    <CheckAccess
      permission={PERMISSIONS_LIST.LocationsList}
      message='No tienes acceso a la lista de ubicaciones'
    >
      <Table
        size='small'
        loading={loading.value.list}
        dataSource={data}
        pagination={{
          position: ['bottomCenter'],
          onChange: handlePaginationChange,
          pageSizeOptions,
          pageSize,
          current: page,
          showSizeChanger: true,
          total,
          showTotal(total, range) {
            return `${range[0]} - ${range[1]} de ${total} ubicaciones`
          },
          responsive: true,
          size: 'default',
          locale: { items_per_page: 'por página' },
        }}
        columns={LocationsTableColumns}
        scroll={{ x: 'max-content', y: 'calc(100dvh - 300px)' }}
        bordered
        sticky={true}
      />
    </CheckAccess>
  )
}

export default LocationsTable
