import React from 'react'
import { Row, Col, Typography, Pagination } from 'antd'

const { Text } = Typography

interface ResultItemsListProps {
  items: any[]
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  type: 'success' | 'error'
}

const ResultItemsList: React.FC<ResultItemsListProps> = ({
  items,
  currentPage,
  pageSize,
  onPageChange,
  type,
}) => {
  const isSuccess = type === 'success'
  const backgroundColor = isSuccess ? '#f6ffed' : '#fff2f0'
  const borderColor = isSuccess ? '#b7eb8f' : '#ffccc7'
  const textColor = isSuccess ? '#389e0d' : '#cf1322'
  const icon = isSuccess ? '✓' : '✗'

  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text strong>
          {isSuccess
            ? 'Registros procesados exitosamente:'
            : 'Errores encontrados en el procesamiento:'}
        </Text>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {paginatedItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '12px',
              marginBottom: '12px',
              backgroundColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '6px',
            }}
          >
            <Row gutter={16}>
              <Col span={4}>
                <Text strong style={{ color: textColor }}>
                  Fila {item.row}
                </Text>
              </Col>
              <Col span={10}>
                {isSuccess ? (
                  <>
                    <Text>
                      <Text strong>Moneda:</Text>{' '}
                      {item.data.currency?.code || 'N/A'} (
                      {item.data.currency?.name || 'N/A'})
                    </Text>
                    <br />
                    <Text>
                      <Text strong>Método de Pago:</Text>{' '}
                      {item.data.paymentMethod?.name || 'N/A'}
                    </Text>
                  </>
                ) : item.data.codigo || item.data.metodo_pago ? (
                  <>
                    <Text>
                      <Text strong>Moneda:</Text> {item.data.codigo || 'N/A'}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>Método de Pago:</Text>{' '}
                      {item.data.metodo_pago || 'N/A'}
                    </Text>
                  </>
                ) : (
                  <Text type='secondary'>Datos incompletos en el archivo</Text>
                )}
              </Col>
              <Col span={10}>
                {isSuccess ? (
                  <>
                    <Text>
                      <Text strong>Precio Compra:</Text> $
                      {item.data.purchasePrice}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>Precio Venta:</Text> ${item.data.salePrice}
                    </Text>
                    <br />
                    <Text>
                      <Text strong>TRM:</Text> ${item.data.trm}
                    </Text>
                  </>
                ) : (
                  <>
                    {item.data.precio_compra && (
                      <>
                        <Text>
                          <Text strong>Precio Compra:</Text> $
                          {item.data.precio_compra}
                        </Text>
                        <br />
                      </>
                    )}
                    {item.data.precio_venta && (
                      <>
                        <Text>
                          <Text strong>Precio Venta:</Text> $
                          {item.data.precio_venta}
                        </Text>
                        <br />
                      </>
                    )}
                    {item.data.trm && (
                      <Text>
                        <Text strong>TRM:</Text> ${item.data.trm}
                      </Text>
                    )}
                  </>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Col span={24}>
                <Text
                  type={isSuccess ? 'success' : 'danger'}
                  style={{ fontSize: '12px' }}
                >
                  {icon} {item.message}
                </Text>
              </Col>
            </Row>
          </div>
        ))}
      </div>

      {items.length > pageSize && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Pagination
            current={currentPage}
            total={items.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} de ${total} registros`
            }
          />
        </div>
      )}
    </div>
  )
}

export default ResultItemsList
