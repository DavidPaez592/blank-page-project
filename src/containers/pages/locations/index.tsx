import React from 'react'
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useLocations } from '@/hooks/useLocations'
import { LocationsState } from '@/state/locations'

import LocationsFormDrawer from './drawers/form'
import LocationsTable from './table'

import './index.scss'

const { Title, Text } = Typography

/**
 * LocationsPage component
 *
 * This component handles the locations page. It displays a table of locations with
 * CRUD operations including create, update, delete and pagination.
 *
 * @returns {JSX.Element} The rendered component
 */
export const LocationsPage: React.FC = (): JSX.Element => {
  const { total, loading, handleAddLocation, handleRefresh } = useLocations()

  return (
    <div className='locations-container'>
      <div className='locations-header'>
        <Card className='header-card'>
          <div className='header-content'>
            <div className='title-section'>
              <Title level={2} className='page-title'>
                Ubicaciones Frecuentes
              </Title>
              <Text type='secondary' className='page-description'>
                Administra las ubicaciones del sistema
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

                <CheckAccess permission={PERMISSIONS_LIST.LocationsCreate}>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={handleAddLocation}
                  >
                    Nueva Ubicación
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
                title='Total de Ubicaciones'
                value={total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div className='locations-content'>
        <LocationsTable />
      </div>

      <LocationsFormDrawer />
    </div>
  )
}

export default LocationsPage
