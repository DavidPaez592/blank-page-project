import { Tabs } from 'antd'
import {
  FormOutlined,
  PrinterOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import type { TabsProps } from 'antd'
import TransfersForm from './TransfersForm'
import { useTransfersAndProvisions } from '@/hooks/useTransfers&Provisions'
import PendingTransferList from './PendingTransferList'

const TransfersPage = () => {
  const transfers = useTransfersAndProvisions()

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Mantenimiento de información',
      children: <TransfersForm {...transfers} />,
      icon: <FormOutlined />,
    },
    {
      key: '2',
      label: 'Imprimir',
      children: <div className='tab-content'>Content for Provision 2</div>,
      icon: <PrinterOutlined />,
    },
    {
      key: '3',
      label: 'Lista',
      children: <PendingTransferList {...transfers} />,
      icon: <OrderedListOutlined />,
    },
  ]

  return (
    <div>
      <Tabs defaultActiveKey='1' items={items} centered />
    </div>
  )
}

export default TransfersPage
