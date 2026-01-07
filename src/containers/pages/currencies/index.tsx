import React from 'react'
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useCurrencies } from '@/hooks/useCurrencies'
import CurrenciesFormDrawer from './drawer/form'
import CurrenciesTable from './table/index.tsx'
import './index.scss'

const { Title, Text } = Typography

/**
 * CurrenciesPage component
 *
 * This component handles the currencies page. It displays a table of currencies with
 * CRUD operations including create, update, delete and pagination.
 *
 * @returns {JSX.Element} The rendered component
 */
export const CurrenciesPage: React.FC = (): JSX.Element => {
  const { total, loading, handleAddCurrency, handleRefresh } = useCurrencies()

  return (
    <div className='currencies-container'>
      <div className='currencies-header'>
        <Card className='header-card'>
          <div className='header-content'>
            <div className='title-section'>
              <Title level={2} className='page-title'>
                Gestión de Monedas
              </Title>
              <Text type='secondary' className='page-description'>
                Administra las monedas del sistema
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

                <CheckAccess permission={PERMISSIONS_LIST.CurrenciesCreate}>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={handleAddCurrency}
                  >
                    Nueva Moneda
                  </Button>
                </CheckAccess>
              </Space>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className='statistics-row'>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title='Total de Monedas'
                value={total.value}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div className='currencies-content'>
        <CurrenciesTable />
      </div>

      {/* Drawers */}
      <CurrenciesFormDrawer />
    </div>
  )
}

export default CurrenciesPage
