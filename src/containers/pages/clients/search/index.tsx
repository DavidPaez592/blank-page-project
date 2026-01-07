import React, { useEffect } from 'react'
import {
  Card,
  Form,
  Select,
  Input,
  Button,
  Empty,
  Descriptions,
  Tag,
  Typography,
  Divider,
  Tabs,
  Table,
} from 'antd'
import {
  SearchOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClearOutlined,
  EditOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { ClientsState } from '@/state/clients'
import { clientsStateActions } from '@/state/clients/actions'
import { ClientRiskAlertsTable } from '../client-risk-alerts'
import './search.scss'

const { Title, Text } = Typography
const { Option } = Select

export const ClientSearch: React.FC = (): JSX.Element => {
  const [form] = Form.useForm()

  useEffect(() => {
    clientsStateActions.getIdentificationTypes()
  }, [])

  const handleSearch = async (values: any) => {
    await clientsStateActions.findClient({
      identificationTypeUId: values.identificationType,
      identificationNumber: values.identificationNumber.trim(),
    })
  }

  const handleClear = () => {
    form.resetFields()
    clientsStateActions.clearSearchedClient()
  }

  const handleEdit = () => {
    if (ClientsState.searchedClient.value) {
      clientsStateActions.openDrawerWithClient(
        ClientsState.searchedClient.value
      )
    }
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className='client-search-card' variant='borderless'>
      <div className='search-header'>
        <Title level={4} className='search-title'>
          <SearchOutlined className='title-icon' />
          Buscar Cliente
        </Title>
        <Text type='secondary' className='search-subtitle'>
          Consulta la información de un cliente por su documento de
          identificación
        </Text>
      </div>

      <Form
        form={form}
        layout='vertical'
        onFinish={handleSearch}
        requiredMark={false}
        size='large'
        className='search-form'
      >
        <div className='form-row'>
          <Form.Item
            name='identificationType'
            label='Tipo de Documento'
            rules={[
              { required: true, message: 'Selecciona el tipo de documento' },
            ]}
            className='form-item-type'
          >
            <Select
              placeholder='Selecciona'
              showSearch
              optionFilterProp='children'
              disabled={ClientsState.searching.value}
            >
              {ClientsState.identificationTypes.value.map((type: any) => (
                <Option key={type.uid} value={type.uid}>
                  {type.label || type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='identificationNumber'
            label='Número de Documento'
            rules={[
              { required: true, message: 'Ingresa el número de documento' },
              { pattern: /^[a-zA-Z0-9]+$/, message: 'Solo letras y números' },
            ]}
            className='form-item-number'
          >
            <Input
              placeholder='Ej: 1234567890'
              prefix={<IdcardOutlined />}
              disabled={ClientsState.searching.value}
            />
          </Form.Item>
        </div>

        <div className='form-actions'>
          <Button
            type='primary'
            htmlType='submit'
            icon={<SearchOutlined />}
            loading={ClientsState.searching.value}
            size='large'
            block
            className='search-button'
          >
            Buscar Cliente
          </Button>
          <Button
            type='default'
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={ClientsState.searching.value}
            size='large'
            className='clear-button'
          >
            Limpiar
          </Button>
        </div>
      </Form>

      {ClientsState.searchedClient.value && (
        <>
          <Divider className='result-divider' />
          <div className='search-result'>
            <div className='result-header'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserOutlined className='result-icon' />
                <Title level={5} className='result-title'>
                  Información del Cliente
                </Title>
              </div>
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={handleEdit}
                size='middle'
              >
                Actualizar
              </Button>
            </div>

            <Tabs
              defaultActiveKey='1'
              type='card'
              size='large'
              tabBarStyle={{ display: 'flex', justifyContent: 'flex-end' }}
              items={[
                {
                  key: '1',
                  label: 'Datos Personales',
                  children: (
                    <>
                      {/* Sección: Datos Personales */}
                      <Divider orientation='left' className='section-divider'>
                        <Text
                          strong
                          style={{ fontSize: '15px', color: '#1890ff' }}
                        >
                          📋 Información Personal
                        </Text>
                      </Divider>
                      <Descriptions
                        bordered
                        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                        size='small'
                        className='client-details'
                      >
                        {ClientsState.searchedClient.value
                          .identificationType && (
                          <Descriptions.Item label='Tipo de Documento'>
                            <Tag color='blue'>
                              {
                                ClientsState.searchedClient.value
                                  .identificationType.label
                              }
                            </Tag>
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label='Número de Documento'>
                          <Text strong style={{ fontSize: '14px' }}>
                            {
                              ClientsState.searchedClient.value
                                .identificationNumber
                            }
                          </Text>
                        </Descriptions.Item>

                        {ClientsState.searchedClient.value.personType && (
                          <Descriptions.Item label='Tipo de Persona'>
                            <Tag color='purple'>
                              {
                                ClientsState.searchedClient.value.personType
                                  .name
                              }
                            </Tag>
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value
                          .verificationDigit && (
                          <Descriptions.Item label='Dígito de Verificación'>
                            {
                              ClientsState.searchedClient.value
                                .verificationDigit
                            }
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.isPep !==
                          undefined && (
                          <Descriptions.Item
                            label='Es PEP'
                            span={
                              ClientsState.searchedClient.value
                                .verificationDigit
                                ? 1
                                : 2
                            }
                          >
                            <Tag color={'green'}>
                              {ClientsState.searchedClient.value.isPep
                                ? 'Sí'
                                : 'No'}
                            </Tag>
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item
                          label='Primer Nombre'
                          span={
                            ClientsState.searchedClient.value.secondName ? 1 : 2
                          }
                        >
                          <Text strong>
                            {ClientsState.searchedClient.value.firstName}
                          </Text>
                        </Descriptions.Item>

                        {ClientsState.searchedClient.value.secondName && (
                          <Descriptions.Item label='Segundo Nombre'>
                            {ClientsState.searchedClient.value.secondName}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item
                          label='Primer Apellido'
                          span={
                            ClientsState.searchedClient.value.secondSurname
                              ? 1
                              : 2
                          }
                        >
                          <Text strong>
                            {ClientsState.searchedClient.value.firstSurname}
                          </Text>
                        </Descriptions.Item>

                        {ClientsState.searchedClient.value.secondSurname && (
                          <Descriptions.Item label='Segundo Apellido'>
                            {ClientsState.searchedClient.value.secondSurname}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label='Nombre Completo' span={2}>
                          <Text
                            strong
                            style={{ fontSize: '14px', color: '#1890ff' }}
                          >
                            {ClientsState.searchedClient.value.fullName}
                          </Text>
                        </Descriptions.Item>

                        {ClientsState.searchedClient.value.birthDate && (
                          <Descriptions.Item
                            label={
                              <>
                                <CalendarOutlined /> Fecha de Nacimiento
                              </>
                            }
                          >
                            {formatDate(
                              ClientsState.searchedClient.value.birthDate
                            )}
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.nationality && (
                          <Descriptions.Item label='Nacionalidad'>
                            <Tag color='orange'>
                              {
                                ClientsState.searchedClient.value.nationality
                                  .dianCode
                              }{' '}
                              -{' '}
                              {
                                ClientsState.searchedClient.value.nationality
                                  .name
                              }
                            </Tag>
                          </Descriptions.Item>
                        )}
                      </Descriptions>

                      {/* Sección: Datos de Residencia */}
                      <Divider orientation='left' className='section-divider'>
                        <Text
                          strong
                          style={{ fontSize: '15px', color: '#1890ff' }}
                        >
                          🏠 Datos de Residencia
                        </Text>
                      </Divider>
                      <Descriptions
                        bordered
                        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                        size='small'
                        className='client-details'
                      >
                        {ClientsState.searchedClient.value.address && (
                          <Descriptions.Item
                            label={
                              <>
                                <HomeOutlined /> Dirección
                              </>
                            }
                            span={2}
                          >
                            {ClientsState.searchedClient.value.address}
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.city && (
                          <Descriptions.Item label='Ciudad' span={2}>
                            <Tag color='geekblue'>
                              {ClientsState.searchedClient.value.city.dianCode}{' '}
                              - {ClientsState.searchedClient.value.city.name}
                            </Tag>
                            <Text
                              type='secondary'
                              style={{ marginLeft: '8px' }}
                            >
                              (
                              {
                                ClientsState.searchedClient.value.city
                                  .departmentName
                              }
                              )
                            </Text>
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.phone1 && (
                          <Descriptions.Item
                            label={
                              <>
                                <PhoneOutlined /> Teléfono 1
                              </>
                            }
                          >
                            <a
                              href={`tel:${ClientsState.searchedClient.value.phone1}`}
                            >
                              {ClientsState.searchedClient.value.phone1}
                            </a>
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.phone2 && (
                          <Descriptions.Item
                            label={
                              <>
                                <PhoneOutlined /> Teléfono 2
                              </>
                            }
                          >
                            <a
                              href={`tel:${ClientsState.searchedClient.value.phone2}`}
                            >
                              {ClientsState.searchedClient.value.phone2}
                            </a>
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.email && (
                          <Descriptions.Item
                            label={
                              <>
                                <MailOutlined /> Email
                              </>
                            }
                            span={2}
                          >
                            <a
                              href={`mailto:${ClientsState.searchedClient.value.email}`}
                            >
                              {ClientsState.searchedClient.value.email}
                            </a>
                          </Descriptions.Item>
                        )}
                      </Descriptions>

                      {/* Sección: Datos Adicionales */}
                      {(ClientsState.searchedClient.value.occupation ||
                        ClientsState.searchedClient.value.ciu ||
                        ClientsState.searchedClient.value.workCity ||
                        ClientsState.searchedClient.value.workCountry ||
                        ClientsState.searchedClient.value.workAddress ||
                        ClientsState.searchedClient.value.legalRepresentative ||
                        ClientsState.searchedClient.value
                          .subscribedCapital) && (
                        <>
                          <Divider
                            orientation='left'
                            className='section-divider'
                          >
                            <Text
                              strong
                              style={{ fontSize: '15px', color: '#1890ff' }}
                            >
                              💼 Información Laboral y Adicional
                            </Text>
                          </Divider>
                          <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                            size='small'
                            className='client-details'
                          >
                            {ClientsState.searchedClient.value.occupation && (
                              <Descriptions.Item label='Ocupación' span={2}>
                                {ClientsState.searchedClient.value.occupation}
                              </Descriptions.Item>
                            )}

                            {ClientsState.searchedClient.value.ciu && (
                              <Descriptions.Item label='CIU' span={2}>
                                <Tag color='cyan'>
                                  {
                                    ClientsState.searchedClient.value.ciu
                                      .dianCode
                                  }
                                </Tag>
                                <Text style={{ marginLeft: '8px' }}>
                                  {
                                    ClientsState.searchedClient.value.ciu
                                      .description
                                  }
                                </Text>
                              </Descriptions.Item>
                            )}

                            {ClientsState.searchedClient.value.workCity && (
                              <Descriptions.Item label='Ciudad de Trabajo'>
                                <Tag color='geekblue'>
                                  {
                                    ClientsState.searchedClient.value.workCity
                                      .dianCode
                                  }{' '}
                                  -{' '}
                                  {
                                    ClientsState.searchedClient.value.workCity
                                      .name
                                  }
                                </Tag>
                              </Descriptions.Item>
                            )}

                            {ClientsState.searchedClient.value.workCountry && (
                              <Descriptions.Item label='País de Trabajo'>
                                <Tag color='orange'>
                                  {
                                    ClientsState.searchedClient.value
                                      .workCountry.dianCode
                                  }{' '}
                                  -{' '}
                                  {
                                    ClientsState.searchedClient.value
                                      .workCountry.name
                                  }
                                </Tag>
                              </Descriptions.Item>
                            )}

                            {ClientsState.searchedClient.value.workAddress && (
                              <Descriptions.Item
                                label='Dirección de Trabajo'
                                span={2}
                              >
                                {ClientsState.searchedClient.value.workAddress}
                              </Descriptions.Item>
                            )}

                            {ClientsState.searchedClient.value
                              .legalRepresentative && (
                              <Descriptions.Item
                                label='Representante Legal'
                                span={2}
                              >
                                {
                                  ClientsState.searchedClient.value
                                    .legalRepresentative
                                }
                              </Descriptions.Item>
                            )}

                            {ClientsState.searchedClient.value
                              .subscribedCapital && (
                              <Descriptions.Item label='Capital Suscrito'>
                                $
                                {ClientsState.searchedClient.value.subscribedCapital.toLocaleString(
                                  'es-CO'
                                )}
                              </Descriptions.Item>
                            )}
                          </Descriptions>
                        </>
                      )}

                      {/* Información del Sistema */}
                      <Divider orientation='left' className='section-divider'>
                        <Text type='secondary' style={{ fontSize: '13px' }}>
                          ℹ️ Información del Sistema
                        </Text>
                      </Divider>
                      <Descriptions
                        bordered
                        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                        size='small'
                        className='client-details'
                      >
                        {ClientsState.searchedClient.value.createdAt && (
                          <Descriptions.Item label='Fecha de Registro'>
                            {formatDate(
                              ClientsState.searchedClient.value.createdAt
                            )}
                          </Descriptions.Item>
                        )}

                        {ClientsState.searchedClient.value.status && (
                          <Descriptions.Item label='Estado'>
                            <Tag
                              color={
                                ClientsState.searchedClient.value.status ===
                                'active'
                                  ? 'green'
                                  : 'red'
                              }
                            >
                              {ClientsState.searchedClient.value.status ===
                              'active'
                                ? 'Activo'
                                : 'Inactivo'}
                            </Tag>
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </>
                  ),
                },
                {
                  key: '2',
                  label: 'Adicionales',
                  children: (
                    <>
                      {/* Sección: Composición Accionaria */}
                      {(ClientsState.searchedClient.value as any)?.shareholders && 
                       (ClientsState.searchedClient.value as any).shareholders.length > 0 && (
                        <>
                          <Divider orientation='left' className='section-divider'>
                            <Text
                              strong
                              style={{ fontSize: '15px', color: '#1890ff' }}
                            >
                              <TeamOutlined style={{ marginRight: 8 }} />
                              Composición Accionaria
                            </Text>
                          </Divider>
                          <Table
                            dataSource={(ClientsState.searchedClient.value as any).shareholders.map((sh: any, idx: number) => ({ ...sh, key: idx }))}
                            pagination={false}
                            size='small'
                            bordered
                            style={{ marginBottom: 24 }}
                            columns={[
                              {
                                title: 'Tipo Documento',
                                dataIndex: 'documentTypeUId',
                                key: 'documentType',
                                render: (uid: string) => {
                                  const type = ClientsState.identificationTypes?.value?.find((t: any) => t.uid === uid)
                                  return <Tag color='blue'>{type?.label || type?.name || 'N/A'}</Tag>
                                }
                              },
                              {
                                title: 'Número Documento',
                                dataIndex: 'documentNumber',
                                key: 'documentNumber',
                                render: (val: string) => <Text strong>{val}</Text>
                              },
                              {
                                title: 'Nombre Completo',
                                key: 'fullName',
                                render: (_: any, record: any) => {
                                  const parts = [
                                    record.firstName,
                                    record.secondName,
                                    record.firstSurname,
                                    record.secondSurname
                                  ].filter(Boolean)
                                  return <Text>{parts.join(' ')}</Text>
                                }
                              },
                              {
                                title: '% Participación',
                                dataIndex: 'percentage',
                                key: 'percentage',
                                render: (val: string) => <Tag color='green'>{val}%</Tag>
                              },
                              {
                                title: 'Es PEP',
                                dataIndex: 'isPep',
                                key: 'isPep',
                                render: (val: boolean) => (
                                  <Tag color={val ? 'red' : 'default'}>
                                    {val ? 'Sí' : 'No'}
                                  </Tag>
                                )
                              },
                            ]}
                          />
                        </>
                      )}

                      <ClientRiskAlertsTable 
                        clientUId={ClientsState.searchedClient.value?.uid}
                      />
                    </>
                  ),
                },
              ]}
            />
          </div>
        </>
      )}
    </Card>
  )
}

export default ClientSearch
