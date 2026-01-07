import { Tabs } from 'antd'
import {
  FormOutlined,
  PrinterOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import type { TabsProps } from 'antd'
import ProvisionsForm from './ProvisionsForm'
import PendingProvisionsList from './PendingProvisionsList'
import { useTransfersAndProvisions } from '@/hooks/useTransfers&Provisions'
import './index.scss'

const ProvisionsPage = () => {
  const provisions = useTransfersAndProvisions()

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Mantenimiento de información',
      children: <ProvisionsForm {...provisions} />,
      icon: <FormOutlined />,
    },
    {
      key: '2',
      label: 'Imprimir',
      children: <div>Pagina de prueba impresion</div>,
      icon: <PrinterOutlined />,
    },
    {
      key: '3',
      label: 'Lista',
      children: <PendingProvisionsList {...provisions} />,
      icon: <OrderedListOutlined />,
    },
  ]

  return (
    <Tabs
      defaultActiveKey='1'
      items={items}
      centered
      className='provisions-tabs'
    />
  )
}

export default ProvisionsPage
