import { useState, useEffect } from 'react'
import { Typography, Input, Select, Checkbox, Button, Row, Col, Table, DatePicker, Spin } from 'antd'
import {
  SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined,
  UndoOutlined, CopyOutlined, CloseOutlined, PrinterOutlined, FilePdfOutlined,
  CloudUploadOutlined, FileTextOutlined, CreditCardOutlined as NotaCreditoIcon,
  QrcodeOutlined, FormOutlined, AppstoreOutlined, UnorderedListOutlined,
  DollarOutlined, CreditCardOutlined, UserOutlined, BankOutlined, TagsOutlined,
  GlobalOutlined
} from '@ant-design/icons'

import { useGetAllCurrencies } from '@/hooks/useCurrencies'
import { useGetAllPaymentMethods } from '@/hooks/usePaymentMethods'
import { ParamsState } from '@/state'
import { paramsStateActions } from '@/state/params/actions'

import './index.scss'

const { Title, Text } = Typography
const { Option } = Select

type InnerTab = 'datos' | 'adicionales' | 'lista'

export const CompraModule = () => {
  const [innerTab, setInnerTab] = useState<InnerTab>('datos')
  const [personaJuridica, setPersonaJuridica] = useState(false)
  const [tipoNegocio, setTipoNegocio] = useState<string | undefined>(undefined)

  // Hooks para obtener datos de las APIs
  const { currencyOptions, loading: loadingCurrencies } = useGetAllCurrencies()
  const { paymentMethodOptions, loading: loadingPaymentMethods } = useGetAllPaymentMethods()
  
  // Cargar tipos de documento
  useEffect(() => {
    paramsStateActions.getIdTypes()
  }, [])
  
  const idTypeOptions = ParamsState.docTypes.value

  const listaColumns = [
    { title: 'Oficina', dataIndex: 'oficina', key: 'oficina' },
    { title: 'Cajero', dataIndex: 'cajero', key: 'cajero' },
    { title: 'Caja', dataIndex: 'caja', key: 'caja' },
    { title: 'Tipo Trans', dataIndex: 'tipoTrans', key: 'tipoTrans' },
    { title: 'Cod Tipo', dataIndex: 'codTipo', key: 'codTipo' },
    { title: 'Documento', dataIndex: 'documento', key: 'documento' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Moneda', dataIndex: 'moneda', key: 'moneda' },
    { title: 'Presentación', dataIndex: 'presentacion', key: 'presentacion' },
  ]
  const listaData: any[] = []

  return (
    <div className="compra-module">
      {/* Pestañas internas centradas - fuera del contenedor principal */}
      <div className="compra-module__inner-tabs">
        <button className={`compra-module__inner-tab ${innerTab === 'datos' ? 'active' : ''}`} onClick={() => setInnerTab('datos')}>
          <FormOutlined /> Datos Compra
        </button>
        <button className={`compra-module__inner-tab ${innerTab === 'adicionales' ? 'active' : ''}`} onClick={() => setInnerTab('adicionales')}>
          <AppstoreOutlined /> Adicionales
        </button>
        <button className={`compra-module__inner-tab ${innerTab === 'lista' ? 'active' : ''}`} onClick={() => setInnerTab('lista')}>
          <UnorderedListOutlined /> Lista
        </button>
      </div>

      <div className="compra-module__wrapper">
        <div className="compra-module__main">
          {/* DATOS COMPRA */}
          {innerTab === 'datos' && (
            <>
              {/* Header */}
            <div className="compra-module__header">
              <div className="compra-module__header-title">
                <DollarOutlined className="compra-module__header-icon" />
                <Title level={5} className="compra-module__title">COMPRA DE DIVISAS</Title>
              </div>
              <div className="compra-module__header-fields">
                <div className="compra-module__field-group compra-module__field-group--header">
                  <label>FECHA</label>
                  <DatePicker size="small" className="compra-module__header-input" />
                </div>
                <div className="compra-module__field-group compra-module__field-group--header">
                  <label>CONSECUTIVO</label>
                  <Input size="small" className="compra-module__header-input" />
                </div>
                <div className="compra-module__field-group compra-module__field-group--header">
                  <label>COMPROBANTE</label>
                  <Input size="small" className="compra-module__header-input" />
                </div>
              </div>
              <div className="compra-module__header-dian">
                <div className="compra-module__dian-row">
                  <Checkbox>ANULADO</Checkbox>
                </div>
                <div className="compra-module__dian-row">
                  <Checkbox>ADJUNTADO DIAN</Checkbox>
                  <Input size="small" placeholder="Código DIAN" className="compra-module__dian-input" />
                </div>
              </div>
            </div>

            <div className="compra-module__grid">
              {/* A Comprar - Una línea */}
              <div className="compra-module__section compra-module__section--highlight compra-module__section--full">
                <div className="compra-module__section-header">
                  <DollarOutlined style={{ marginRight: 8 }} />
                  <span className="compra-module__section-title">A comprar</span>
                </div>
                <div className="compra-module__section-body">
                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={12} md={8} lg={5}>
                      <div className="compra-module__field-group">
                        <label>MONEDA</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="compra-module__select"
                          loading={loadingCurrencies.value}
                          options={currencyOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5}>
                      <div className="compra-module__field-group">
                        <label>PRESENTACIÓN</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="compra-module__select"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5}>
                      <div className="compra-module__field-group">
                        <label>CANTIDAD</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={5}>
                      <div className="compra-module__field-group">
                        <label>TASA DE CAMBIO</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={4}>
                      <div className="compra-module__field-group">
                        <label>IMPTO. COMPRA</label>
                        <Input size="small" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Forma de Pago - 3 columnas */}
              <div className="compra-module__section compra-module__section--full">
                <div className="compra-module__section-header">
                  <CreditCardOutlined style={{ marginRight: 8 }} />
                  <span className="compra-module__section-title">Forma de pago</span>
                </div>
                <div className="compra-module__section-body">
                  <Row gutter={[16, 12]}>
                    {/* Fila 1: NEGOCIO, VALOR EFECTIVO, VALOR CHEQUE */}
                    <Col xs={24} sm={12} md={8}>
                      <div className="compra-module__field-group">
                        <label>NEGOCIO</label>
                        <Select 
                          size="small" 
                          value={tipoNegocio} 
                          onChange={(value) => setTipoNegocio(value)}
                          className="compra-module__select"
                          placeholder="Seleccionar"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="compra-module__field-group">
                        <label>VALOR EFECTIVO</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className="compra-module__field-group">
                        <label>VALOR CHEQUE</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    {/* Fila 2: MONEDA, RETE FUENTE, PRESENTACIÓN EF, PRESENTACIÓN CH */}
                    <Col xs={24} sm={12} md={6}>
                      <div className="compra-module__field-group">
                        <label>MONEDA</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="compra-module__select"
                          loading={loadingCurrencies.value}
                          options={currencyOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="compra-module__field-group">
                        <label>RETE FUENTE</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="compra-module__field-group">
                        <label>PRESENTACIÓN EF:</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="compra-module__select"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="compra-module__field-group">
                        <label>PRESENTACIÓN CH:</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="compra-module__select"
                          loading={loadingPaymentMethods.value}
                          options={paymentMethodOptions.value}
                        />
                      </div>
                    </Col>
                    {/* Fila 3: BANCO, CUENTA, NO CHEQUE (solo si no es Efectivo) */}
                    {tipoNegocio && paymentMethodOptions.value?.find(pm => pm.value === tipoNegocio)?.label?.toLowerCase() !== 'efectivo' && (
                      <>
                        <Col xs={24} sm={12} md={8}>
                          <div className="compra-module__field-group">
                            <label>BANCO</label>
                            <Input size="small" />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <div className="compra-module__field-group">
                            <label>CUENTA</label>
                            <Input size="small" />
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <div className="compra-module__field-group">
                            <label>NO CHEQUE</label>
                            <Input size="small" />
                          </div>
                        </Col>
                      </>
                    )}
                    {/* Fila 4: EQUIVALENCIA */}
                    <Col span={24}>
                      <div className="compra-module__field-group">
                        <label>EQUIVALENCIA EN MONEDA DE CAMBIO</label>
                        <Input size="small" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Cliente */}
              <div className="compra-module__section compra-module__section--full">
                <div className="compra-module__section-header">
                  <UserOutlined style={{ marginRight: 8 }} />
                  <span className="compra-module__section-title">Cliente</span>
                </div>
                <div className="compra-module__section-body">
                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={12} md={6}>
                      <div className="compra-module__field-group">
                        <label>TIPO DOC.</label>
                        <Select 
                          size="small" 
                          placeholder="Seleccionar" 
                          className="compra-module__select"
                          options={idTypeOptions}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="compra-module__field-group">
                        <label>IDENTIFICACIÓN</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className="compra-module__field-group">
                        <label>NOMBRE</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="compra-module__client-actions">
                        <Button type="primary" icon={<EditOutlined />} className="compra-module__client-btn">
                          Capturar firma
                        </Button>
                        <Button type="primary" icon={<FileTextOutlined />} className="compra-module__client-btn">
                          Digitalizar documento
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Persona Jurídica */}
              <div className="compra-module__section">
                <div className="compra-module__section-header compra-module__section-header--check">
                  <Checkbox checked={personaJuridica} onChange={(e) => setPersonaJuridica(e.target.checked)} />
                  <BankOutlined style={{ marginLeft: 8, marginRight: 8 }} />
                  <span className="compra-module__section-title">Persona jurídica</span>
                </div>
                <div className="compra-module__section-body">
                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={8} md={6}>
                        <div className="compra-module__field-group">
                          <label>TIPO DOC.</label>
                          <Select 
                            size="small" 
                            placeholder="Seleccionar" 
                            className="compra-module__select" 
                            disabled={!personaJuridica}
                            options={idTypeOptions}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={16} md={9}>
                        <div className="compra-module__field-group">
                          <label>NOMBRE</label>
                          <Input size="small" disabled={!personaJuridica} />
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={9}>
                        <div className="compra-module__field-group">
                          <label>DOC VENTA BENEF.</label>
                          <Input size="small" disabled={!personaJuridica} />
                        </div>
                      </Col>
                      <Col xs={24} sm={8} md={6}>
                        <div className="compra-module__field-group">
                          <label>DECLARANTE</label>
                          <Select 
                            size="small" 
                            placeholder="Seleccionar" 
                            className="compra-module__select" 
                            disabled={!personaJuridica}
                            options={idTypeOptions}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={16} md={9}>
                        <div className="compra-module__field-group">
                          <label>NOMBRE</label>
                          <Input size="small" disabled={!personaJuridica} />
                        </div>
                      </Col>
                    </Row>
                  </div>
              </div>

              {/* Origen */}
              <div className="compra-module__section">
                <div className="compra-module__section-header">
                  <GlobalOutlined style={{ marginRight: 8 }} />
                  <span className="compra-module__section-title">Origen</span>
                </div>
                <div className="compra-module__section-body">
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <div className="compra-module__field-group">
                        <label>ORIGEN DIVISAS</label>
                        <Input size="small" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="compra-module__field-group">
                        <label>OBS</label>
                        <Input size="small" />
                      </div>
                    </Col>
                  </Row>
                  <Checkbox className="compra-module__checkbox-full">
                    Agregar esta transacción al reporte de operaciones sospechosas del día
                  </Checkbox>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="compra-module__actions">
              <Button icon={<SearchOutlined />}>Buscar</Button>
              <Button type="primary" icon={<PlusOutlined />}>Nuevo</Button>
              <Button danger icon={<DeleteOutlined />}>Eliminar</Button>
              <Button icon={<EditOutlined />}>Editar</Button>
              <Button icon={<SaveOutlined />}>Grabar</Button>
              <Button icon={<UndoOutlined />}>Deshacer</Button>
              <Button icon={<CopyOutlined />}>Copiar</Button>
              <Button danger icon={<CloseOutlined />}>Salir</Button>
              <Button icon={<PrinterOutlined />}>Imprimir</Button>
              <Button icon={<FilePdfOutlined />}>DDC</Button>
            </div>
          </>
        )}

        {/* ADICIONALES */}
        {innerTab === 'adicionales' && (
          <div className="compra-module__adicionales">
            <div className="compra-module__adicionales-section">
              <div className="compra-module__adicionales-header">
                <span className="compra-module__adicionales-title">Documento de compra</span>
              </div>
              <div className="compra-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={8}><div className="compra-module__field-group"><label>FORMATOS DISPONIBLES</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="compra-module__field-group"><label>NÚMERO DOCUMENTO</label><Input size="small" /></div></Col>
                  <Col span={4}><div className="compra-module__field-group"><label>ARCHIVO FORMATO</label><Input size="small" /></div></Col>
                  <Col span={4}><div className="compra-module__field-group"><label>&nbsp;</label><Button icon={<FilePdfOutlined />} className="compra-module__pdf-btn" /></div></Col>
                </Row>
              </div>
            </div>
            <div className="compra-module__adicionales-section">
              <div className="compra-module__adicionales-header">
                <span className="compra-module__adicionales-title">Cheque</span>
              </div>
              <div className="compra-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={14}><div className="compra-module__field-group"><label>FORMATOS DISPONIBLES</label><Input size="small" /></div></Col>
                  <Col span={2}><div className="compra-module__field-group"><label>&nbsp;</label><Button type="primary" icon={<FilePdfOutlined />} size="small" className="compra-module__client-btn" /></div></Col>
                  <Col span={8}></Col>
                </Row>
                <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                  <Col span={8}><div className="compra-module__field-group"><label>NÚMERO CHEQUE</label><Input size="small" /></div></Col>
                  <Col span={8}><Checkbox style={{ marginTop: 24 }}>Formato cheque externo</Checkbox></Col>
                  <Col span={8}></Col>
                </Row>
                <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                  <Col span={16}><div className="compra-module__field-group"><label>ARCHIVO FORMATO</label><Input size="small" /></div></Col>
                  <Col span={8}></Col>
                </Row>
                <Row gutter={[16, 12]} style={{ marginTop: 12 }}>
                  <Col span={16}><div className="compra-module__field-group"><label>FORMATOS CON TÍTULOS</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="compra-module__field-group"><label>&nbsp;</label><Button type="primary" icon={<TagsOutlined />} className="compra-module__client-btn">Títulos</Button></div></Col>
                </Row>
              </div>
            </div>
            <div className="compra-module__adicionales-section">
              <div className="compra-module__adicionales-header">
                <span className="compra-module__adicionales-title">Origen de fondos</span>
              </div>
              <div className="compra-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={16}><div className="compra-module__field-group"><label>PLANTILLA CARTA</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="compra-module__field-group"><label>&nbsp;</label><Button>Generar</Button></div></Col>
                </Row>
              </div>
            </div>
            <div className="compra-module__adicionales-section">
              <div className="compra-module__adicionales-header">
                <span className="compra-module__adicionales-title">Comprobante de Egreso</span>
              </div>
              <div className="compra-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={8}><div className="compra-module__field-group"><label>DOCUMENTO EGRESO</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="compra-module__field-group"><label>FORMATO</label><Input size="small" /></div></Col>
                  <Col span={8}><div className="compra-module__field-group"><label>&nbsp;</label><Button icon={<FilePdfOutlined />} className="compra-module__pdf-btn" /></div></Col>
                </Row>
              </div>
            </div>
            <div className="compra-module__adicionales-section">
              <div className="compra-module__adicionales-header">
                <span className="compra-module__adicionales-title">Otros impuestos</span>
              </div>
              <div className="compra-module__adicionales-body">
                <Row gutter={[16, 12]}>
                  <Col span={6}><div className="compra-module__field-group"><label>ReteIVA</label><Input size="small" /></div></Col>
                  <Col span={6}><div className="compra-module__field-group"><label>ReteICA</label><Input size="small" /></div></Col>
                  <Col span={6}><div className="compra-module__field-group"><label>4 X MIL</label><Input size="small" /></div></Col>
                  <Col span={6}><div className="compra-module__field-group"><label>&nbsp;</label><Button type="primary" className="compra-module__client-btn">Calcular</Button></div></Col>
                </Row>
              </div>
            </div>
          </div>
        )}

        {/* LISTA */}
        {innerTab === 'lista' && (
          <div className="compra-module__lista">
            <div className="compra-module__lista-table">
              <Table columns={listaColumns} dataSource={listaData} pagination={false} size="small" locale={{ emptyText: 'Sin datos' }} />
            </div>
            <div className="compra-module__lista-total">
              <Text className="compra-module__lista-total-label">Total registros:</Text>
              <Text className="compra-module__lista-total-value">{listaData.length}</Text>
            </div>
          </div>
        )}
        </div>

        {/* Sidebar - Siempre visible */}
        <div className="compra-module__sidebar">
          <div className="compra-module__stats">
            <div className="compra-module__stat">
              <span className="compra-module__stat-label">Compras Hoy</span>
              <span className="compra-module__stat-value">$0</span>
            </div>
            <div className="compra-module__stat">
              <span className="compra-module__stat-label">Compras Mes</span>
              <span className="compra-module__stat-value">$0</span>
            </div>
            <div className="compra-module__stat">
              <span className="compra-module__stat-label">Compras Año</span>
              <span className="compra-module__stat-value">$0</span>
            </div>
          </div>
          <div className="compra-module__sidebar-buttons">
            {/* <Button icon={<CloudUploadOutlined />}>Adjuntar DIAN</Button>
            <Button icon={<FileTextOutlined />}>Ver Documento DIAN</Button>
            <Button icon={<NotaCreditoIcon />}>Ver Nota Crédito DIAN</Button>
            <Button icon={<QrcodeOutlined />}>Imprimir QR</Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompraModule
