import React from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { PaymentMethodsState } from '@/state'

// Import components
import PaymentMethodsFormDrawer from './drawer'
import PaymentMethodsTable from './table/index.tsx'

import './index.scss'

const { Title, Text } = Typography

/**
 * PaymentMethodsPage component
 *
 * This component renders the main payment methods management page.
 * It includes statistics, table view, and access controls.
 *
 * @returns {JSX.Element} The rendered component
 */
export const PaymentMethodsPage: React.FC = (): JSX.Element => {
  const { loading, handleAddPaymentMethod, handleClearFilters } =
    usePaymentMethods()

  const handleRefresh = () => {
    handleClearFilters()
  }

  return (
    <CheckAccess
      permission={PERMISSIONS_LIST.PaymentMethodsList}
      message='No tienes acceso al módulo de métodos de pago'
    >
      <div className='payment-methods-container'>
        <div className='payment-methods-header'>
          <Card className='header-card'>
            <div className='header-content'>
              <div className='title-section'>
                <Title level={2} className='page-title'>
                  Métodos de Pago
                </Title>
                <Text type='secondary' className='page-description'>
                  Gestiona los métodos de pago disponibles en el sistema
                </Text>
              </div>

              <div className='actions-section'>
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading.value.list}
                  >
                    Actualizar
                  </Button>

                  <CheckAccess
                    permission={PERMISSIONS_LIST.PaymentMethodsCreate}
                  >
                    <Button
                      type='primary'
                      icon={<PlusOutlined />}
                      onClick={handleAddPaymentMethod}
                    >
                      Nuevo Método
                    </Button>
                  </CheckAccess>
                </Space>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className='payment-methods-content'>
          <Card
            title='Gestión de Métodos de Pago'
            className='payment-methods-table-card'
            loading={loading.value.list}
          >
            <PaymentMethodsTable />
          </Card>
        </div>

        {/* Form Drawer */}
        <PaymentMethodsFormDrawer />
      </div>
    </CheckAccess>
  )
}

export default PaymentMethodsPage
