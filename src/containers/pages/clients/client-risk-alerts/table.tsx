import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Card,
  Typography,
  Tooltip,
  Modal,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import { ClientRiskAlertsState } from '@/state/client-risk-alerts'
import { clientRiskAlertsStateActions } from '@/state/client-risk-alerts/actions'
import {
  EClientRiskAlertStatus,
  EClientRiskAlertReason,
  type IClientRiskAlert,
} from '@/interfaces/client-risk-alerts'
import ClientRiskAlertsFormDrawer from './drawer/form'

import './table.scss'

const { Title } = Typography
const { Option } = Select
const { confirm } = Modal

// Status options for filter
const STATUS_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'Activa', value: EClientRiskAlertStatus.Active },
  { label: 'En Revisión', value: EClientRiskAlertStatus.UnderReview },
  { label: 'Resuelta - Falso Positivo', value: EClientRiskAlertStatus.ResolvedFalsePositive },
  { label: 'Resuelta - Confirmada', value: EClientRiskAlertStatus.ResolvedConfirmed },
]

// Reason options for filter
const REASON_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Patrón de Transacción Inusual', value: EClientRiskAlertReason.UnusualTransactionPattern },
  { label: 'Inconsistencia en Documentos', value: EClientRiskAlertReason.DocumentInconsistency },
  { label: 'Coincidencia en Lista de Sanciones', value: EClientRiskAlertReason.SanctionListMatchInternal },
  { label: 'Intento de Fraude Reportado', value: EClientRiskAlertReason.ReportedFraudAttempt },
  { label: 'Otro', value: EClientRiskAlertReason.Other },
]

// Helper functions for display
const getStatusColor = (status: EClientRiskAlertStatus) => {
  switch (status) {
    case EClientRiskAlertStatus.Active:
      return 'error'
    case EClientRiskAlertStatus.UnderReview:
      return 'warning'
    case EClientRiskAlertStatus.ResolvedFalsePositive:
      return 'blue'
    case EClientRiskAlertStatus.ResolvedConfirmed:
      return 'success'
    default:
      return 'default'
  }
}

const getStatusLabel = (status: EClientRiskAlertStatus) => {
  switch (status) {
    case EClientRiskAlertStatus.Active:
      return 'Activa'
    case EClientRiskAlertStatus.UnderReview:
      return 'En Revisión'
    case EClientRiskAlertStatus.ResolvedFalsePositive:
      return 'Falso Positivo'
    case EClientRiskAlertStatus.ResolvedConfirmed:
      return 'Confirmada'
    default:
      return status
  }
}

const getReasonLabel = (reason: EClientRiskAlertReason) => {
  switch (reason) {
    case EClientRiskAlertReason.UnusualTransactionPattern:
      return 'Transacción Inusual'
    case EClientRiskAlertReason.DocumentInconsistency:
      return 'Inconsistencia Documentos'
    case EClientRiskAlertReason.SanctionListMatchInternal:
      return 'Lista de Sanciones'
    case EClientRiskAlertReason.ReportedFraudAttempt:
      return 'Fraude Reportado'
    case EClientRiskAlertReason.Other:
      return 'Otro'
    default:
      return reason
  }
}

interface Props {
  clientUId?: string // If provided, filter alerts for specific client
}

export const ClientRiskAlertsTable: React.FC<Props> = ({ clientUId }): JSX.Element => {
  const [searchText, setSearchText] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [reasonFilter, setReasonFilter] = useState<string>('')

  useEffect(() => {
    // Set client filter if provided
    if (clientUId) {
      clientRiskAlertsStateActions.updateFilters({ clientUId })
    }
    
    // Load initial data
    clientRiskAlertsStateActions.getList()
  }, [clientUId])

  const handleSearch = () => {
    clientRiskAlertsStateActions.updateFilters({ 
      search: searchText,
      status: statusFilter as EClientRiskAlertStatus || undefined,
      clientUId: clientUId,
    })
    clientRiskAlertsStateActions.getList()
  }

  const handleReload = () => {
    clientRiskAlertsStateActions.getList()
  }

  const handleEdit = (alert: IClientRiskAlert) => {
    clientRiskAlertsStateActions.openDrawerWithAlert(alert)
  }

  const handleDelete = (alertUid: string) => {
    confirm({
      title: '¿Estás seguro de eliminar esta alerta?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        await clientRiskAlertsStateActions.delete(alertUid)
      },
    })
  }

  const handleTableChange = (pagination: any) => {
    clientRiskAlertsStateActions.changePage(pagination.current, pagination.pageSize)
  }

  const columns: ColumnsType<IClientRiskAlert> = [
    {
      title: 'Motivo',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: EClientRiskAlertReason) => (
        <Tag color="blue">{getReasonLabel(reason)}</Tag>
      ),
      width: 160,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: EClientRiskAlertStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
      width: 130,
    },
    {
      title: 'Notas',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => (
        <Tooltip title={notes}>
          <div
            style={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {notes || '-'}
          </div>
        </Tooltip>
      ),
      width: 200,
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
      width: 120,
      sorter: true,
    },
    {
      title: 'Fecha Resolución',
      dataIndex: 'resolvedAt',
      key: 'resolvedAt',
      render: (date: string) => (
        date ? (
          <div>
            <div>{dayjs(date).format('DD/MM/YYYY')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {dayjs(date).format('HH:mm')}
            </div>
          </div>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      ),
      width: 120,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record: IClientRiskAlert) => {
        const isResolved = 
          record.status === EClientRiskAlertStatus.ResolvedFalsePositive ||
          record.status === EClientRiskAlertStatus.ResolvedConfirmed
        
        const isUnderReview = record.status === EClientRiskAlertStatus.UnderReview
        
        return (
          <Space size="small">
            {/* Show edit button only if not resolved */}
            {!isResolved && (
              <Tooltip title="Editar alerta">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  size="small"
                />
              </Tooltip>
            )}
            
            {/* Show delete button only if not under review and not resolved */}
            {!isUnderReview && !isResolved && (
              <Tooltip title="Eliminar alerta">
                <Popconfirm
                  title="¿Eliminar alerta?"
                  description="Esta acción no se puede deshacer"
                  onConfirm={() => handleDelete(record.uid)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                  />
                </Popconfirm>
              </Tooltip>
            )}
            
            {/* Show message when no actions available */}
            {isResolved && (
              <span style={{ color: '#999', fontSize: '12px' }}>Sin acciones</span>
            )}
          </Space>
        )
      },
      width: 120,
      fixed: 'right',
    },
  ]

  return (
    <div className="client-risk-alerts-table">
      <Card>
        <div className="table-header">
          <Title level={4} style={{ margin: 0 }}>
            ⚠️ Alertas de Riesgo
          </Title>
          {clientUId && ClientRiskAlertsState.alerts.value && ClientRiskAlertsState.alerts.value.length > 0 && (
            <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
              <Typography.Text style={{ fontSize: '14px', color: '#666' }}>
                📋 Alertas de riesgo del cliente: <strong>{ClientRiskAlertsState.alerts.value[0]?.client?.fullName || `${ClientRiskAlertsState.alerts.value[0]?.client?.firstName} ${ClientRiskAlertsState.alerts.value[0]?.client?.firstSurname}`}</strong> 
                {ClientRiskAlertsState.alerts.value[0]?.client?.identificationNumber && (
                  <span> - {ClientRiskAlertsState.alerts.value[0]?.client?.identificationNumber}</span>
                )}
              </Typography.Text>
            </div>
          )}
          
          <div className="table-filters">
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Buscar por notas o cliente..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={handleSearch}
                  suffix={<SearchOutlined />}
                />
              </Col>
              
              <Col xs={24} sm={6}>
                <Select
                  placeholder="Estado"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {STATUS_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={6}>
                <Select
                  placeholder="Motivo"
                  value={reasonFilter}
                  onChange={setReasonFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {REASON_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={4}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  >
                    Buscar
                  </Button>
                  
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReload}
                    loading={ClientRiskAlertsState.loading.value}
                  />
                </Space>
              </Col>
            </Row>
          </div>
        </div>

        <div className="table-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => clientRiskAlertsStateActions.openDrawer(clientUId)}
          >
            Nueva Alerta
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={ClientRiskAlertsState.alerts.value}
          rowKey="uid"
          loading={ClientRiskAlertsState.loading.value}
          pagination={{
            current: ClientRiskAlertsState.pagination.value?.current || 1,
            pageSize: ClientRiskAlertsState.pagination.value?.pageSize || 10,
            total: ClientRiskAlertsState.pagination.value?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} alertas`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>

      <ClientRiskAlertsFormDrawer />
    </div>
  )
}

export default ClientRiskAlertsTable