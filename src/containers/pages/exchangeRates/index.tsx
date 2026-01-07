import React, { useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useExchangeRates } from '@/hooks/useExchangeRates'

import ExchangeRatesFormDrawer from './drawer/form'
import ExchangeRatesTable from './table'
import BulkUploadModal from './bulkUpload/modal'

import './index.scss'

const { Title, Text } = Typography

export const ExchangeRatesPage: React.FC = (): JSX.Element => {
  const { handleAddExchangeRate, filters } = useExchangeRates()
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false)

  return (
    <div className='exchange-rates-container'>
      <div className='exchange-rates-header'>
        <div className='header-content'>
          <div className='title-section'>
            <Title level={2} className='page-title'>
              Gestión de Tasas de Cambio
            </Title>
            <Text type='secondary' className='page-description'>
              Administra las tasas de cambio entre monedas
            </Text>
          </div>

          <div className='actions-section'>
            <Space>
              <CheckAccess permission={PERMISSIONS_LIST.ExchangeRatesCreate}>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={handleAddExchangeRate}
                >
                  Nueva Tasa de Cambio
                </Button>
              </CheckAccess>

              <CheckAccess
                permission={PERMISSIONS_LIST.ExchangeRatesBulkUpload}
              >
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => setBulkUploadModalOpen(true)}
                >
                  Carga Masiva
                </Button>
              </CheckAccess>
            </Space>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='exchange-rates-content'>
        <ExchangeRatesTable />
      </div>

      {/* Drawers */}
      <ExchangeRatesFormDrawer />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        open={bulkUploadModalOpen}
        onCancel={() => setBulkUploadModalOpen(false)}
        selectedOfficeUId={filters.value.officeUId}
      />
    </div>
  )
}

export default ExchangeRatesPage
