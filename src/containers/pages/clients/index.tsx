import React from 'react'
import { Row, Col, FloatButton, Space } from 'antd'
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons'
import { clientsStateActions } from '@/state/clients/actions'
import ClientSearch from './search'
import ClientsFormDrawer from './drawer/form'

import './index.scss'

/**
 * ClientsPage component
 *
 * This component handles the clients page. It displays a search card
 * and includes a drawer for creating new clients.
 * Mobile-first responsive design with an attractive and intuitive UI.
 *
 * @returns {JSX.Element} The rendered component
 */
export const ClientsPage: React.FC = (): JSX.Element => {
  return (
    <div className='clients-container'>
      <div className='clients-header'>
        <div className='header-content'>
          <Space align='center' size='middle' className='header-title-wrapper'>
            <TeamOutlined className='header-icon' />
            <div>
              <h2 className='page-title'>Gestión de Clientes</h2>
              <p className='page-subtitle'>
                Busca y registra clientes de forma rápida y sencilla
              </p>
            </div>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]} className='clients-content'>
        <Col xs={24} lg={24}>
          <ClientSearch />
        </Col>
      </Row>

      <ClientsFormDrawer />

      {/* Floating Action Button */}
      <FloatButton
        icon={<UserAddOutlined />}
        type='primary'
        tooltip='Crear Nuevo Cliente'
        onClick={clientsStateActions.openDrawer}
        className='create-client-fab'
        style={{
          right: 24,
          bottom: 24,
          width: 60,
          height: 60,
        }}
        badge={{
          dot: false,
        }}
      />
    </div>
  )
}

export default ClientsPage
