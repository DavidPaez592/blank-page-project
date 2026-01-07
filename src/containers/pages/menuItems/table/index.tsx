import { FloatButton, Table } from 'antd'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useGetMenuItemsList } from '@/hooks/useMenuItem'
import { MenuItemsState } from '@/state'
import { menuItemsStateActions } from '@/state/actions'
import { IoAddCircle } from 'react-icons/io5'
import { MenuItemsTableColumns } from './config'

/**
 * MenuItemTable component
 *
 * This component displays a table of menu items. It includes a floating button for creating new menu items
 * and handles pagination, loading state, and access permissions.
 *
 * @returns {JSX.Element} The rendered component
 */
export const MenuItemTable: React.FC = (): JSX.Element => {
  const { loading } = useGetMenuItemsList()
  const { total, pageSize, page, pageSizeOptions, data } =
    MenuItemsState.pagination.value

  return (
    <>
      <h2 className='page-title'>Items del menú</h2>

      <CheckAccess permission={PERMISSIONS_LIST.MenuItemCreate}>
        <FloatButton
          style={{
            position: 'absolute',
            right: '37px',
            bottom: '15px',
          }}
          tooltip='Crear menú'
          icon={<IoAddCircle />}
          type='primary'
          onClick={menuItemsStateActions.addMenuItem}
          shape='square'
        />
      </CheckAccess>

      <CheckAccess
        permission={PERMISSIONS_LIST.MenuItemList}
        message='No tienes acceso a la lista de menú items'
      >
        <Table
          size='small'
          loading={loading.value}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            onChange: menuItemsStateActions.changePagination,
            pageSizeOptions,
            pageSize,
            current: page,
            showSizeChanger: true,
            total,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} items`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={MenuItemsTableColumns}
          scroll={{ y: 'calc(100dvh - 132px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}

export default MenuItemTable
