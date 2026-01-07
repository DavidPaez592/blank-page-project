import React from 'react'
import {
  Table,
  Card,
  Space,
  Button,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Select,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useGetAllOffices } from '@/hooks/useOffices'
import { ExchangeRatesTableColumns } from './config'

export const ExchangeRatesTable: React.FC = (): JSX.Element => {
  const {
    paginatedExchangeRates,
    loading,
    currentPage,
    pageSize,
    total,
    filters,
    handlePaginationChange,
    handleApplyFilters,
    loadExchangeRates,
  } = useExchangeRates()

  const { officeOptions } = useGetAllOffices()

  const handleSearch = async () => {
    const currentFilters = filters.value

    if (!currentFilters.officeUId) {
      message.warning(
        'Debe seleccionar una oficina para buscar tasas de cambio'
      )
      return
    }

    // Si no hay fecha, usar la fecha actual
    if (!currentFilters.date) {
      const currentDate = new Date().toISOString().split('T')[0]
      handleApplyFilters({ ...currentFilters, date: currentDate })
    }

    await loadExchangeRates()
  }

  const handleDateChange = (date: any, dateString: string | string[]) => {
    const dateStr = Array.isArray(dateString) ? dateString[0] : dateString
    handleApplyFilters({ ...filters.value, date: dateStr })
  }

  const handleOfficeChange = (value: string) => {
    handleApplyFilters({ ...filters.value, officeUId: value })
  }

  return (
    <Card
      title='Lista de Tasas de Cambio'
      className='exchange-rates-table-card'
      extra={
        <Space>
          <span style={{ fontSize: '12px', color: '#666' }}>
            Selecciona oficina y fecha, luego haz clic en "Buscar"
          </span>
        </Space>
      }
    >
      {/* Filters */}
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} lg={4}>
            <DatePicker
              placeholder='Fecha (YYYY-MM-DD)'
              value={filters.value.date ? dayjs(filters.value.date) : null}
              onChange={handleDateChange}
              allowClear
              style={{ width: '100%' }}
              format='YYYY-MM-DD'
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder='Selecciona una oficina (requerido)'
              value={filters.value.officeUId || undefined}
              onChange={handleOfficeChange}
              allowClear
              style={{ width: '100%' }}
              options={officeOptions.value}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Button
              type='primary'
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading.value.list}
              style={{ width: '100%' }}
            >
              Buscar
            </Button>
          </Col>
        </Row>
      </div>

      <Table
        columns={ExchangeRatesTableColumns}
        dataSource={paginatedExchangeRates.value}
        loading={loading.value.list}
        pagination={{
          current: currentPage.value,
          pageSize: pageSize.value,
          total: total.value,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} tasas de cambio`,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handlePaginationChange,
          onShowSizeChange: handlePaginationChange,
        }}
        rowKey='uid'
        scroll={{ x: 800 }}
        size='middle'
      />
    </Card>
  )
}

export default ExchangeRatesTable
