import React from 'react'
import { Row, Col, Statistic, Typography } from 'antd'

const { Title } = Typography

interface ResultSummaryProps {
  uploadResult: {
    total: number
    success: number
    failed: number
  }
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ uploadResult }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={4}>Resumen de la Carga</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title='Total Procesados'
            value={uploadResult.total}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title='Exitosos'
            value={uploadResult.success}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title='Errores'
            value={uploadResult.failed}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default ResultSummary
