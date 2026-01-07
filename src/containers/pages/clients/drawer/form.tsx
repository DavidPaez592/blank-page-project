import React, { useEffect, useState } from 'react'
import {
  Drawer,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  notification,
  Modal,
  Button,
  Steps,
  Alert,
  Table,
} from 'antd'
import { MdAddCircle, MdPersonAdd, MdWork, MdBusiness } from 'react-icons/md'
import { SaveOutlined, SearchOutlined, UserAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { ClientsState } from '@/state/clients'
import { clientsStateActions } from '@/state/clients/actions'
import clientsRequests from '@/state/clients/requests'
import { CLIENT_FORM_FIELDS } from '@/constants/forms'
import { LocationAutoComplete } from '@/components/locationAutoComplete'
import { addressValidator, calculateVerificationDigit } from '@/helpers'

import './form.scss'

const { Title, Text } = Typography
const { Item: FormItem } = Form
const { Option } = Select
const { TextArea } = Input

export const ClientsFormDrawer: React.FC = (): JSX.Element => {
  const [clientForm] = Form.useForm()
  const [repLegalForm] = Form.useForm()

  const [selectedPersonType, setSelectedPersonType] = useState<string | null>(
    null
  )
  const [isJuridica, setIsJuridica] = useState(false)
  const [verificationDigit, setVerificationDigit] = useState<number | null>(
    null
  )
  const [searchingCountries, setSearchingCountries] = useState(false)
  const [countrySearchTimeout, setCountrySearchTimeout] =
    useState<NodeJS.Timeout | null>(null)
  const [searchingCities, setSearchingCities] = useState(false)
  const [citySearchTimeout, setCitySearchTimeout] =
    useState<NodeJS.Timeout | null>(null)
  const [searchingCius, setSearchingCius] = useState(false)
  const [ciuSearchTimeout, setCiuSearchTimeout] =
    useState<NodeJS.Timeout | null>(null)
  
  // Estados para Rep Legal
  const [repLegalSearchType, setRepLegalSearchType] = useState<string>('')
  const [repLegalSearchNumber, setRepLegalSearchNumber] = useState('')
  const [repLegalNotFound, setRepLegalNotFound] = useState(false)
  const [searchingRepLegal, setSearchingRepLegal] = useState(false)
  const [showRepLegalModal, setShowRepLegalModal] = useState(false)
  const [repLegalModalStep, setRepLegalModalStep] = useState(0)
  const [repLegalFormData, setRepLegalFormData] = useState<any>({})
  const [repLegalUId, setRepLegalUId] = useState<string | null>(null)
  const [repLegalCreatedName, setRepLegalCreatedName] = useState<string | null>(null)

  // Estados locales para el modal (ciudades y CIIUs separados del formulario principal)
  const [modalCities, setModalCities] = useState<any[]>([])
  const [modalCius, setModalCius] = useState<any[]>([])
  const [searchingModalCities, setSearchingModalCities] = useState(false)
  const [searchingModalCius, setSearchingModalCius] = useState(false)

  // Estados para OFAC
  const [checkingOfac, setCheckingOfac] = useState(false)
  const [ofacBlocked, setOfacBlocked] = useState(false)
  const [ofacBlockedPerson, setOfacBlockedPerson] = useState<string | null>(null)

  // Estados para Composición Accionaria
  const [shareholders, setShareholders] = useState<any[]>([])
  const [editingShareholder, setEditingShareholder] = useState<any>(null)
  const [shareholderForm] = Form.useForm()

  // Estado para pasos del formulario principal
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    clientsStateActions.getIdentificationTypes()
    clientsStateActions.getPersonTypes()
  }, [])

  useEffect(() => {
    if (ClientsState.openDrawer.value) {
      clientForm.resetFields()
      setSelectedPersonType(null)
      setIsJuridica(false)
      setVerificationDigit(null)
      setRepLegalSearchType('')
      setRepLegalSearchNumber('')
      setRepLegalNotFound(false)
      setRepLegalUId(null)
      setRepLegalCreatedName(null)
      setOfacBlocked(false)
      setOfacBlockedPerson(null)
      setShareholders([])
      shareholderForm.resetFields()
      setEditingShareholder(null)
      setCurrentStep(0)

      const loadValues = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))

        const currentClient = ClientsState.currentClient.value

        if (currentClient && Object.keys(currentClient).length > 0) {
          const formValues: any = {}

          if (currentClient.identificationType?.uid) {
            formValues.identificationType = currentClient.identificationType.uid
          }
          if (currentClient.identificationNumber) {
            formValues.identificationNumber = currentClient.identificationNumber
          }
          if (currentClient.personType?.uid) {
            formValues.personType = currentClient.personType.uid
            setSelectedPersonType(currentClient.personType.uid)
            setIsJuridica(currentClient.personType.name === 'Jurídica')
          }
          if (currentClient.verificationDigit !== undefined) {
            formValues.verificationDigit = currentClient.verificationDigit
            setVerificationDigit(Number(currentClient.verificationDigit))
          }
          if (currentClient.isPep !== undefined) {
            formValues.isPep = currentClient.isPep
          }

          if (currentClient.firstName)
            formValues.firstName = currentClient.firstName
          if (currentClient.secondName)
            formValues.secondName = currentClient.secondName
          if (currentClient.firstSurname)
            formValues.firstSurname = currentClient.firstSurname
          if (currentClient.secondSurname)
            formValues.secondSurname = currentClient.secondSurname
          if (currentClient.fullName)
            formValues.fullName = currentClient.fullName

          if (currentClient.birthDate) {
            formValues.birthDate = dayjs(currentClient.birthDate)
          }

          const allCountries: any[] = []

          if (currentClient.nationality?.dianCode) {
            const nationalityCountries = await clientsStateActions.getCountries(
              currentClient.nationality.dianCode
            )
            allCountries.push(...nationalityCountries)
          }

          if (currentClient.workCountry?.dianCode) {
            const workCountries = await clientsStateActions.getCountries(
              currentClient.workCountry.dianCode
            )
            workCountries.forEach((country: any) => {
              if (!allCountries.find((c: any) => c.uid === country.uid)) {
                allCountries.push(country)
              }
            })
          }

          if (allCountries.length > 0) {
            ClientsState.countries.value = allCountries
          }

          if (currentClient.nationality) {
            formValues.nationality = currentClient.nationality.uid
          }

          if (currentClient.address) formValues.address = currentClient.address

          const allCities: any[] = []

          if (currentClient.city?.dianCode) {
            const residenceCities = await clientsStateActions.getCities(
              currentClient.city.dianCode
            )
            allCities.push(...residenceCities)
          }

          if (currentClient.workCity?.dianCode) {
            const workCities = await clientsStateActions.getCities(
              currentClient.workCity.dianCode
            )
            workCities.forEach((city: any) => {
              if (!allCities.find((c: any) => c.uid === city.uid)) {
                allCities.push(city)
              }
            })
          }

          if (allCities.length > 0) {
            ClientsState.cities.value = allCities
          }

          if (currentClient.city) {
            formValues.cityUId = currentClient.city.uid
          }

          if (currentClient.phone1) formValues.phone1 = currentClient.phone1
          if (currentClient.phone2) formValues.phone2 = currentClient.phone2
          if (currentClient.email) formValues.email = currentClient.email

          if (currentClient.occupation)
            formValues.occupation = currentClient.occupation
          if (currentClient.ciu) {
            await clientsStateActions.getCius(currentClient.ciu.description)
            formValues.ciuCode = currentClient.ciu.uid
          }

          if (currentClient.workCity) {
            formValues.workCity = currentClient.workCity.uid
          }
          if (currentClient.workCountry) {
            formValues.workCountry = currentClient.workCountry.uid
          }
          if (currentClient.workAddress)
            formValues.workAddress = currentClient.workAddress

          // Cargar representante legal si existe
          if (currentClient.legalRepresentativeUId) {
            setRepLegalUId(currentClient.legalRepresentativeUId)
            // Si viene el nombre del representante, mostrarlo en el input verde
            if (currentClient.legalRepresentative) {
              setRepLegalCreatedName(currentClient.legalRepresentative)
              formValues.legalRepresentative = currentClient.legalRepresentative
            } else {
              // Si solo viene el UID, mostrar indicador genérico
              setRepLegalCreatedName('Representante legal asignado')
            }
          }
          if (currentClient.subscribedCapital) {
            formValues.subscribedCapital = currentClient.subscribedCapital
          }

          clientForm.setFieldsValue(formValues)

          // Cargar composición accionaria si existe
          if (currentClient.shareholders && Array.isArray(currentClient.shareholders)) {
            setShareholders(currentClient.shareholders)
          }
        } else {
          const naturalPersonType = ClientsState.personTypes.value.find(
            (pt: any) => pt.name === 'Natural'
          )

          await clientsStateActions.getCountries('Colombia')

          const colombiaCountry = ClientsState.countries.value.find(
            (c: any) => c.dianCode === '169'
          )

          const defaultValues: any = {}

          if (naturalPersonType) {
            defaultValues.personType = naturalPersonType.uid
            setSelectedPersonType(naturalPersonType.uid)
          }

          if (colombiaCountry) {
            defaultValues.nationality = colombiaCountry.uid
            // Establecer Colombia como país de trabajo por defecto
            defaultValues.workCountry = colombiaCountry.uid
          }

          if (Object.keys(defaultValues).length > 0) {
            clientForm.setFieldsValue(defaultValues)
          }
        }
      }

      loadValues()
    } else {
      if (countrySearchTimeout) {
        clearTimeout(countrySearchTimeout)
        setCountrySearchTimeout(null)
      }
      if (citySearchTimeout) {
        clearTimeout(citySearchTimeout)
        setCitySearchTimeout(null)
      }
      if (ciuSearchTimeout) {
        clearTimeout(ciuSearchTimeout)
        setCiuSearchTimeout(null)
      }
      ClientsState.countries.value = []
      ClientsState.cities.value = []
      ClientsState.cius.value = []
    }
  }, [ClientsState.openDrawer.value])

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const nameFields = [
      'firstName',
      'secondName',
      'firstSurname',
      'secondSurname',
    ]
    const hasNameFieldChanged = Object.keys(changedValues).some((key) =>
      nameFields.includes(key)
    )

    if (hasNameFieldChanged) {
      const fullName = [
        allValues.firstName,
        allValues.secondName,
        allValues.firstSurname,
        allValues.secondSurname,
      ]
        .filter(Boolean)
        .join(' ')

      clientForm.setFieldsValue({ fullName })
    }

    if (changedValues.personType) {
      const personTypeUid = changedValues.personType
      setSelectedPersonType(personTypeUid)

      const personType = ClientsState.personTypes.value.find(
        (pt: any) => pt.uid === personTypeUid
      )

      const isJuridica = personType?.name === 'Jurídica'
      setIsJuridica(isJuridica)

      if (!isJuridica) {
        setVerificationDigit(null)
        clientForm.setFieldsValue({ 
          verificationDigit: null,
          legalRepresentative: null,
          subscribedCapital: null 
        })
        setRepLegalSearchType('')
        setRepLegalSearchNumber('')
        setRepLegalNotFound(false)
      } else {
        const identificationNumber = allValues.identificationNumber
        if (identificationNumber) {
          const dv = calculateVerificationDigit(identificationNumber)
          setVerificationDigit(dv)
          clientForm.setFieldsValue({ verificationDigit: dv })
        }
      }
    }

    if (changedValues.identificationNumber && selectedPersonType) {
      const personType = ClientsState.personTypes.value.find(
        (pt: any) => pt.uid === selectedPersonType
      )

      if (personType?.name === 'Jurídica') {
        const dv = calculateVerificationDigit(
          changedValues.identificationNumber
        )
        setVerificationDigit(dv)
        clientForm.setFieldsValue({ verificationDigit: dv })
      }
    }
  }

  const handleCountrySearch = async (value: string) => {
    if (countrySearchTimeout) {
      clearTimeout(countrySearchTimeout)
    }

    if (!value || value.length < 2) {
      if (!value) {
        ClientsState.countries.value = []
      }
      return
    }

    setSearchingCountries(true)

    const timeout = setTimeout(async () => {
      try {
        const results = await clientsStateActions.getCountries(value)

        if (results.length === 0) {
          notification.info({
            message: 'Sin resultados',
            description: `No se encontraron países con "${value}"`,
            duration: 3,
          })
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Error al buscar países',
          duration: 3,
        })
      } finally {
        setSearchingCountries(false)
      }
    }, 500)

    setCountrySearchTimeout(timeout)
  }

  const handleCountryFocus = async () => {}

  const handleCitySearch = async (value: string) => {
    if (citySearchTimeout) {
      clearTimeout(citySearchTimeout)
    }

    if (!value || value.length < 2) {
      if (!value) {
        ClientsState.cities.value = []
      }
      return
    }

    setSearchingCities(true)

    const timeout = setTimeout(async () => {
      try {
        const results = await clientsStateActions.getCities(value)

        if (results.length === 0) {
          notification.info({
            message: 'Sin resultados',
            description: `No se encontraron ciudades con "${value}"`,
            duration: 3,
          })
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Error al buscar ciudades',
          duration: 3,
        })
      } finally {
        setSearchingCities(false)
      }
    }, 500)

    setCitySearchTimeout(timeout)
  }

  const handleCityFocus = async () => {}

  const handleCiuSearch = async (value: string) => {
    if (ciuSearchTimeout) {
      clearTimeout(ciuSearchTimeout)
    }

    if (!value || value.length < 2) {
      if (!value) {
        ClientsState.cius.value = []
      }
      return
    }

    setSearchingCius(true)

    const timeout = setTimeout(async () => {
      try {
        const results = await clientsStateActions.getCius(value)

        if (results.length === 0) {
          notification.info({
            message: 'Sin resultados',
            description: `No se encontraron CIIUs con "${value}"`,
            duration: 3,
          })
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Error al buscar CIIUs',
          duration: 3,
        })
      } finally {
        setSearchingCius(false)
      }
    }, 500)

    setCiuSearchTimeout(timeout)
  }

  const handleCiuFocus = async () => {}

  // Handlers específicos para el modal (usan estados locales)
  const handleModalCitySearch = async (value: string) => {
    if (!value || value.length < 2) {
      if (!value) {
        setModalCities([])
      }
      return
    }

    setSearchingModalCities(true)

    try {
      const results = await clientsStateActions.getCities(value)
      setModalCities(results || [])
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al buscar ciudades',
        duration: 3,
      })
    } finally {
      setSearchingModalCities(false)
    }
  }

  const handleModalCiuSearch = async (value: string) => {
    if (!value || value.length < 2) {
      if (!value) {
        setModalCius([])
      }
      return
    }

    setSearchingModalCius(true)

    try {
      const results = await clientsStateActions.getCius(value)
      setModalCius(results || [])
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al buscar CIIUs',
        duration: 3,
      })
    } finally {
      setSearchingModalCius(false)
    }
  }

  // Funciones para Rep Legal
  const handleRepLegalSearch = async () => {
    if (!repLegalSearchType) {
      notification.warning({
        message: 'Tipo de identificación requerido',
        description: 'Por favor seleccione el tipo de identificación',
        duration: 4,
      })
      return
    }

    if (!repLegalSearchNumber || repLegalSearchNumber.trim().length === 0) {
      notification.warning({
        message: 'Número de identificación requerido',
        description: 'Por favor ingrese el número de identificación',
        duration: 4,
      })
      return
    }

    setSearchingRepLegal(true)
    setRepLegalNotFound(false)
    // Limpiar el campo del formulario y el UID al iniciar nueva búsqueda
    setRepLegalUId(null)
    clientForm.setFieldsValue({
      legalRepresentative: undefined
    })

    try {
      const identificationNumber = repLegalSearchNumber.trim()

      // Usar clientsRequests directamente para NO afectar ClientsState.searchedClient (evita mostrar tabla externa)
      const response = await clientsRequests.findClient({
        identificationTypeUId: repLegalSearchType,
        identificationNumber: identificationNumber,
      })

      if (response?.data && response.data.fullName) {
        // Guardar el UID y el nombre del representante legal
        const clientUid = response.data.uid
        setRepLegalUId(clientUid || null)
        clientForm.setFieldsValue({
          legalRepresentative: response.data.fullName
        })
        // También guardar el nombre para mostrar en el input verde
        setRepLegalCreatedName(response.data.fullName)
        setRepLegalNotFound(false)
        notification.success({
          message: 'Cliente encontrado',
          description: `Se seleccionó a ${response.data.fullName} como representante legal`,
          duration: 3,
        })
      } else {
        setRepLegalNotFound(true)
        notification.info({
          message: 'Cliente no encontrado',
          description: 'No se encontró un cliente con esos datos. Puede crear uno nuevo.',
          duration: 4,
        })
      }
    } catch (error: any) {
      setRepLegalNotFound(true)
      notification.error({
        message: 'Error en la búsqueda',
        description: error?.response?.data?.message || error?.message || 'Ocurrió un error al buscar el representante legal',
        duration: 4,
      })
    } finally {
      setSearchingRepLegal(false)
    }
  }

  const handleOpenRepLegalModal = () => {
    setShowRepLegalModal(true)
    setRepLegalModalStep(0)
    repLegalForm.resetFields()
    
    clientForm.setFieldsValue({ legalRepresentative: null })
    setRepLegalSearchType('')
    setRepLegalSearchNumber('')
    setRepLegalNotFound(false)
    
    // Limpiar estados locales del modal (ciudades y CIIUs)
    setModalCities([])
    setModalCius([])
    
    setTimeout(async () => {
      // Cargar datos necesarios para el modal (sin precargar ciudades ni CIIUs)
      await clientsStateActions.getIdentificationTypes()
      await clientsStateActions.getPersonTypes()
      
      const naturalPersonType = ClientsState.personTypes.value.find(
        (pt: any) => pt.name === 'Natural'
      )
      
      await clientsStateActions.getCountries('Colombia')
      const colombiaCountry = ClientsState.countries.value.find(
        (c: any) => c.dianCode === '169'
      )

      const defaultValues: any = {}

      if (naturalPersonType) {
        defaultValues.personType = naturalPersonType.uid
      }

      if (colombiaCountry) {
        defaultValues.nationality = colombiaCountry.uid
        defaultValues.workCountry = colombiaCountry.uid
      }

      if (Object.keys(defaultValues).length > 0) {
        repLegalForm.setFieldsValue(defaultValues)
      }
    }, 100)
  }

  const handleCloseRepLegalModal = () => {
    setShowRepLegalModal(false)
    setRepLegalModalStep(0)
    setRepLegalFormData({})
    repLegalForm.resetFields()
  }

  const handleRepLegalModalNext = async () => {
    try {
      const currentStepFields = getFieldsForStep(repLegalModalStep)
      await repLegalForm.validateFields(currentStepFields)
      
      // Guardar los valores del paso actual
      const currentValues = repLegalForm.getFieldsValue()
      setRepLegalFormData({ ...repLegalFormData, ...currentValues })
      
      //console.log('📦 Valores guardados hasta ahora:', { ...repLegalFormData, ...currentValues })
      
      if (repLegalModalStep < 2) {
        setRepLegalModalStep(repLegalModalStep + 1)
      } else {
        await handleSaveRepLegal()
      }
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  const handleRepLegalModalPrev = () => {
    setRepLegalModalStep(repLegalModalStep - 1)
  }

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return [
          'identificationType',
          'personType',
          'identificationNumber',
          'isPep',
          'firstSurname',
          'secondSurname',
          'firstName',
          'secondName',
          'fullName',
          'birthDate',
          'nationality',
        ]
      case 1:
        return [
          'address',
          'cityUId',
          'phone1',
          'phone2',
          'email',
        ]
      case 2:
        return [
          'occupation',
          'ciuCode',
          'workCity',
          'workCountry',
          'workAddress',
        ]
      default:
        return []
    }
  }

  const handleSaveRepLegal = async () => {
    try {
      // Obtener los valores del último paso
      const lastStepValues = repLegalForm.getFieldsValue()
      
      // Combinar todos los valores guardados de pasos anteriores con el paso actual
      const allValues = { ...repLegalFormData, ...lastStepValues }
      
      //console.log('=== VALORES COMPLETOS DEL FORM MODAL ===', allValues)

      const clientData = {
        identificationTypeUId: allValues.identificationType,
        identificationNumber: allValues.identificationNumber,
        personTypeUId: allValues.personType,
        isPep: allValues.isPep || false,
        firstName: allValues.firstName,
        secondName: allValues.secondName || null,
        firstSurname: allValues.firstSurname,
        secondSurname: allValues.secondSurname || null,
        birthDate: allValues.birthDate ? dayjs(allValues.birthDate).format('YYYY-MM-DD') : null,
        nationalityUId: allValues.nationality || null,
        address: allValues.address || null,
        cityUId: allValues.cityUId || null,
        phone1: allValues.phone1 || null,
        phone2: allValues.phone2 || null,
        email: allValues.email || null,
        occupation: allValues.occupation || null,
        ciuUId: allValues.ciuCode || null,
        workAddress: allValues.workAddress || null,
        workCityUId: allValues.workCity || null,
        workCountryUId: allValues.workCountry, // Required field - no null fallback
      }

      // Llamar directamente a la API sin usar clientsStateActions para evitar cerrar el drawer padre
      ClientsState.loading.value = true
      const response: any = await clientsRequests.createClient(clientData)
      ClientsState.loading.value = false

      console.log('=== RESPUESTA createClient para Rep Legal ===', JSON.stringify(response?.data, null, 2))

      // Construir el nombre completo del representante legal creado
      const fullName = [
        allValues.firstName,
        allValues.secondName,
        allValues.firstSurname,
        allValues.secondSurname
      ].filter(Boolean).join(' ')

      // Siempre mostrar el nombre del representante legal creado
      setRepLegalCreatedName(fullName)
      clientForm.setFieldsValue({
        legalRepresentative: fullName
      })

      // Si la respuesta tiene el UID del cliente creado, guardarlo para el payload
      // La respuesta viene como { client: { uid: ... } }
      if (response?.data?.client?.uid) {
        setRepLegalUId(response.data.client.uid)
      } else if (response?.data?.uid) {
        // Fallback por si la estructura es diferente
        setRepLegalUId(response.data.uid)
      }

      notification.success({
        message: 'Representante legal creado',
        description: 'El representante legal se creó exitosamente y se asignó al formulario',
        duration: 3,
      })

      handleCloseRepLegalModal()
    } catch (error: any) {
      ClientsState.loading.value = false
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message || 'Error al crear el representante legal',
        duration: 4,
      })
    }
  }

  // Funciones para Composición Accionaria
  const handleAddShareholder = async () => {
    try {
      const values = await shareholderForm.validateFields()
      
      // Consultar OFAC antes de agregar
      setCheckingOfac(true)
      
      try {
        // Buscar por número de documento
        const response = await clientsRequests.searchOfac(values.documentNumber)
        
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          // Persona encontrada en lista OFAC - BLOQUEAR
          const ofacPerson = response.data[0]
          const personName = values.firstName + (values.secondName ? ' ' + values.secondName : '') + 
            ' ' + values.firstSurname + (values.secondSurname ? ' ' + values.secondSurname : '')
          
          setOfacBlocked(true)
          setOfacBlockedPerson(personName)
          
          notification.error({
            message: '⛔ ALERTA OFAC',
            description: `El accionista "${personName}" se encuentra en la lista OFAC. No se puede continuar con la creación del cliente.`,
            duration: 0, // No auto-cerrar
          })
          
          setCheckingOfac(false)
          return // No agregar el accionista
        }
        
        // También buscar por nombre completo
        const fullNameSearch = [
          values.firstName,
          values.secondName,
          values.firstSurname, 
          values.secondSurname
        ].filter(Boolean).join(' ')
        
        const responseByName = await clientsRequests.searchOfac(fullNameSearch)
        
        if (responseByName?.data && Array.isArray(responseByName.data) && responseByName.data.length > 0) {
          // Persona encontrada en lista OFAC por nombre - BLOQUEAR
          setOfacBlocked(true)
          setOfacBlockedPerson(fullNameSearch)
          
          notification.error({
            message: '⛔ ALERTA OFAC',
            description: `El accionista "${fullNameSearch}" se encuentra en la lista OFAC. No se puede continuar con la creación del cliente.`,
            duration: 0,
          })
          
          setCheckingOfac(false)
          return // No agregar el accionista
        }
        
      } catch (ofacError: any) {
        console.error('Error consultando OFAC:', ofacError)
        // Si hay error en la consulta OFAC, mostrar advertencia pero continuar
        notification.warning({
          message: 'Advertencia OFAC',
          description: 'No se pudo verificar la lista OFAC. Por favor verifique manualmente.',
          duration: 5,
        })
      }
      
      setCheckingOfac(false)
      
      // Si no está en OFAC, proceder normalmente
      if (editingShareholder !== null) {
        // Editar accionista existente
        const updatedShareholders = [...shareholders]
        updatedShareholders[editingShareholder] = values
        setShareholders(updatedShareholders)
        setEditingShareholder(null)
      } else {
        // Agregar nuevo accionista
        setShareholders([...shareholders, values])
      }
      shareholderForm.resetFields()
      
      notification.success({
        message: 'Accionista verificado',
        description: 'El accionista no se encuentra en la lista OFAC y fue agregado correctamente.',
        duration: 3,
      })
      
    } catch (validationError) {
      console.log('Validation error:', validationError)
    }
  }

  const handleEditShareholder = (index: number) => {
    setEditingShareholder(index)
    shareholderForm.setFieldsValue(shareholders[index])
  }

  const handleDeleteShareholder = (index: number) => {
    const updatedShareholders = shareholders.filter((_, i) => i !== index)
    setShareholders(updatedShareholders)
  }

  const handleCancelShareholder = () => {
    setEditingShareholder(null)
    shareholderForm.resetFields()
  }

  // Funciones de navegación para pasos del formulario principal
  const handleNext = async () => {
    try {
      // Validar campos del paso actual antes de avanzar
      const fieldsToValidate = getFieldsForMainStep(currentStep)
      if (fieldsToValidate.length > 0) {
        await clientForm.validateFields(fieldsToValidate)
      }
      
      const currentValues = clientForm.getFieldsValue()
      console.log(`=== PASO ${currentStep} → ${currentStep + 1} ===`)
      console.log('Valores actuales del formulario:', currentValues)
      console.log('Shareholders actuales:', shareholders)
      
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Error validando campos:', error)
      // No avanzar si hay errores de validación
      notification.error({
        message: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios antes de continuar',
      })
    }
  }

  const handlePrev = () => {
    const currentValues = clientForm.getFieldsValue()
    console.log(`=== PASO ${currentStep} → ${currentStep - 1} ===`)
    console.log('Valores actuales del formulario:', currentValues)
    console.log('Shareholders actuales:', shareholders)
    
    setCurrentStep(currentStep - 1)
  }

  // Función para obtener los campos a validar según el paso
  const getFieldsForMainStep = (step: number): string[] => {
    switch (step) {
      case 0: // Datos Básicos
        return [
          'identificationType',
          'personType',
          'identificationNumber',
          'firstName',
          'firstSurname',
        ]
      case 1: // Datos Personales
        return [
          'birthDate',
          'nationality',
          'address',
          'cityUId',
          'phone1',
          'email',
        ]
      case 2: // Datos Laborales
        return [
          'occupation',
          'ciuCode',
          'workCountry',
        ]
      case 3: // Datos Adicionales y Composición Accionaria
        return []
      default:
        return []
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await clientForm.validateFields()

      console.log('=== VALORES DEL FORMULARIO ===', values)
      console.log('=== SHAREHOLDERS ARRAY ===', shareholders)

      const personType = ClientsState.personTypes.value.find(
        (pt: any) => pt.uid === values.personType
      )
      const isJuridico = personType?.name === 'Jurídica'

      const clientData = {
        identificationTypeUId: values.identificationType,
        identificationNumber: values.identificationNumber,
        verificationDigit: isJuridico
          ? verificationDigit !== null
            ? String(verificationDigit)
            : null
          : null,
        personTypeUId: values.personType,
        firstName: values.firstName,
        secondName: values.secondName || null,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname || null,
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format('YYYY-MM-DD')
          : null,
        birthPlace: null,
        nationalityUId: values.nationality || null,
        isPep: values.isPep || false,
        address: values.address || null,
        cityUId: values.cityUId || null,
        phone1: values.phone1 || null,
        phone2: values.phone2 || null,
        email: values.email || null,
        occupation: values.occupation || null,
        ciuUId: values.ciuCode || null,
        workAddress: values.workAddress || null,
        workCityUId: values.workCity || null,
        workCountryUId: values.workCountry, // Required field - no null fallback
        code: null,
        branchOffice: null,
        legalRepresentativeUId: repLegalUId || null,
        subscribedCapital: values.subscribedCapital
          ? parseFloat(values.subscribedCapital)
          : null,
        additionalData: null,
        shareholders: shareholders.length > 0 ? shareholders : undefined,
      }

      console.log('=== PAYLOAD A ENVIAR ===', JSON.stringify(clientData, null, 2))

      const currentClient = ClientsState.currentClient.value
      const isEditing =
        currentClient &&
        Object.keys(currentClient).length > 0 &&
        currentClient.uid

      let success = false
      if (isEditing && currentClient.uid) {
        success = await clientsStateActions.updateClient(
          currentClient.uid,
          clientData
        )
      } else {
        success = await clientsStateActions.createClient(clientData)
      }

      if (success) {
        clientForm.resetFields()
        setSelectedPersonType(null)
        setVerificationDigit(null)
      }
    } catch (error) {}
  }

  const isEditing =
    ClientsState.currentClient.value &&
    Object.keys(ClientsState.currentClient.value).length > 0 &&
    ClientsState.currentClient.value.uid

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdPersonAdd size={24} />
          <span>
            {isEditing ? 'Actualizar Cliente' : 'Crear Nuevo Cliente'}
          </span>
        </div>
      }
      placement='right'
      width='80%'
      onClose={clientsStateActions.closeDrawer}
      open={ClientsState.openDrawer.value}
      className='clients-form-drawer'
      destroyOnClose
      maskClosable={false}
      styles={{
        body: { paddingBottom: 80 },
      }}
    >
      <div className='drawer-content'>
        <Steps
          current={currentStep}
          style={{ marginBottom: 24 }}
          items={[
            {
              title: 'Datos Básicos',
              icon: <MdPersonAdd />,
            },
            {
              title: 'Datos Personales',
              icon: <MdPersonAdd />,
            },
            {
              title: 'Datos Laborales',
              icon: <MdWork />,
            },
            // Solo mostrar paso 4 para Jurídica
            ...(isJuridica ? [{
              title: 'Rep. Legal y Accionistas',
              icon: <MdBusiness />,
            }] : []),
          ]}
        />

        <Form
          form={clientForm}
          layout='vertical'
          requiredMark={true}
          size='middle'
          className='client-form'
          onValuesChange={handleValuesChange}
          preserve={true}
        >
          {/* Paso 0: Datos Básicos */}
          <div className='form-section' style={{ display: currentStep === 0 ? 'block' : 'none' }}>
            <Title level={5} className='section-title'>
              👤 Datos Básicos
            </Title>

            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.identificationType.value}
                  label='Tipo Documento'
                  rules={[
                    {
                      required: true,
                      message: 'Selecciona el tipo de documento',
                    },
                  ]}
                >
                  <Select
                    placeholder='Selecciona el tipo'
                    showSearch
                    optionFilterProp='children'
                  >
                    {ClientsState.identificationTypes.value.map((type: any) => (
                      <Option key={type.uid} value={type.uid}>
                        {type.label || type.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.personType.value}
                  label='Tipo Contribuyente'
                  rules={[
                    {
                      required: true,
                      message: 'Selecciona el tipo de contribuyente',
                    },
                  ]}
                >
                  <Select
                    placeholder='Selecciona el tipo'
                    showSearch
                    optionFilterProp='children'
                  >
                    {ClientsState.personTypes.value.map((type: any) => (
                      <Option key={type.uid} value={type.uid}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col
                xs={24}
                sm={
                  selectedPersonType &&
                  ClientsState.personTypes.value.find(
                    (pt: any) => pt.uid === selectedPersonType
                  )?.name === 'Jurídica'
                    ? 9
                    : 12
                }
              >
                <FormItem
                  name={CLIENT_FORM_FIELDS.identificationNumber.value}
                  label={
                    selectedPersonType &&
                    ClientsState.personTypes.value.find(
                      (pt: any) => pt.uid === selectedPersonType
                    )?.name === 'Jurídica'
                      ? 'NIT'
                      : 'Identificación'
                  }
                  rules={[
                    {
                      required: true,
                      message: 'El número de identificación es requerido',
                    },
                    {
                      pattern: /^[a-zA-Z0-9]+$/,
                      message: 'Solo letras y números',
                    },
                  ]}
                >
                  <Input
                    placeholder={
                      selectedPersonType &&
                      ClientsState.personTypes.value.find(
                        (pt: any) => pt.uid === selectedPersonType
                      )?.name === 'Jurídica'
                        ? 'Ej: 9001234567'
                        : 'Ej: 1234567890'
                    }
                  />
                </FormItem>
              </Col>

              {selectedPersonType &&
                ClientsState.personTypes.value.find(
                  (pt: any) => pt.uid === selectedPersonType
                )?.name === 'Jurídica' && (
                  <Col xs={24} sm={3}>
                    <FormItem
                      name='verificationDigit'
                      label='DV'
                      tooltip='Dígito de Verificación calculado automáticamente'
                    >
                      <Input
                        disabled
                        value={
                          verificationDigit !== null ? verificationDigit : ''
                        }
                        placeholder='-'
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                      />
                    </FormItem>
                  </Col>
                )}

              <Col xs={24} sm={6}>
                <FormItem
                  name='isPep'
                  label='PEP o Familiar de PEP'
                  valuePropName='checked'
                  initialValue={false}
                  tooltip='Persona Expuesta Políticamente'
                >
                  <Switch
                    checkedChildren='Sí'
                    unCheckedChildren='No'
                    style={{ width: 'auto' }}
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.firstSurname.value}
                  label='Primer Apellido'
                  rules={[
                    {
                      required: true,
                      message: 'El primer apellido es requerido',
                    },
                    { min: 2, message: 'Mínimo 2 caracteres' },
                    { max: 50, message: 'Máximo 50 caracteres' },
                  ]}
                >
                  <Input placeholder='Ingrese el primer apellido' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.secondSurname.value}
                  label='Segundo Apellido'
                  rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                >
                  <Input placeholder='Ingrese el segundo apellido (opcional)' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.firstName.value}
                  label='Primer Nombre'
                  rules={[
                    {
                      required: true,
                      message: 'El primer nombre es requerido',
                    },
                    { min: 2, message: 'Mínimo 2 caracteres' },
                    { max: 50, message: 'Máximo 50 caracteres' },
                  ]}
                >
                  <Input placeholder='Ingrese el primer nombre' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='secondName'
                  label='Segundo Nombre'
                  rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                >
                  <Input placeholder='Ingrese el segundo nombre (opcional)' />
                </FormItem>
              </Col>

              <Col xs={24}>
                <FormItem name='fullName' label='Nombre Completo'>
                  <Input placeholder='Nombre completo del cliente' readOnly />
                </FormItem>
              </Col>
            </Row>

            <Row gutter={[12, 0]} style={{ marginTop: 24 }}>
              <Col xs={24} style={{ textAlign: 'right' }}>
                <Button type='primary' onClick={handleNext}>
                  Siguiente
                </Button>
              </Col>
            </Row>
          </div>

          {/* Paso 1: Datos Personales */}
          <div className='form-section' style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <Title level={5} className='section-title'>
              📋 Datos Personales
            </Title>

            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.birthDate.value}
                  label='Fecha Nacimiento'
                  rules={[
                    {
                      required: true,
                      message: 'La fecha de nacimiento es requerida',
                    },
                  ]}
                >
                  <DatePicker
                    placeholder='Selecciona fecha'
                    format='DD/MM/YYYY'
                    style={{ width: '100%' }}
                    disabledDate={(current) =>
                      current && current > dayjs().endOf('day')
                    }
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='nationality' 
                  label='Nacionalidad'
                  rules={[
                    {
                      required: true,
                      message: 'La nacionalidad es requerida',
                    },
                  ]}
                >
                  <Select
                    placeholder='Escribe para buscar nacionalidad'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleCountrySearch}
                    onFocus={handleCountryFocus}
                    loading={searchingCountries}
                    notFoundContent={
                      searchingCountries
                        ? 'Buscando...'
                        : ClientsState.countries.value.length === 0
                          ? 'Escribe para buscar países'
                          : 'No se encontraron resultados'
                    }
                  >
                    {ClientsState.countries.value.map((country: any) => (
                      <Option key={country.uid} value={country.uid}>
                        {country.dianCode
                          ? `${country.dianCode} - ${country.name}`
                          : country.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>

            <Title level={5} className='section-title' style={{ marginTop: 24 }}>
              🏠 Datos de Residencia Temporal/Permanente en Colombia
            </Title>

            <Row gutter={[12, 0]}>
              <Col xs={24}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.address.value}
                  label='Dirección'
                  rules={[
                    {
                      required: true,
                      message: 'La dirección es requerida',
                    },
                    { max: 200, message: 'Máximo 200 caracteres' },
                    addressValidator(),
                  ]}
                  tooltip='Selecciona una ubicación frecuente o escribe la dirección manualmente. Formato válido: Calle 123 #45-67'
                >
                  <LocationAutoComplete
                    placeholder='Selecciona o escribe la dirección de residencia'
                    maxLength={200}
                    onLocationSelect={async (cityUId, cityName) => {
                      if (cityUId) {
                        const existingCity = ClientsState.cities.value.find(
                          (c: any) => c.uid === cityUId
                        )

                        if (!existingCity && cityName) {
                          setSearchingCities(true)
                          try {
                            await clientsStateActions.getCities(cityName)
                          } finally {
                            setSearchingCities(false)
                          }
                        }

                        clientForm.setFieldsValue({
                          [CLIENT_FORM_FIELDS.city.value]: cityUId,
                        })
                      }
                    }}
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.city.value}
                  label='Ciudad'
                  rules={[
                    {
                      required: true,
                      message: 'Selecciona la ciudad',
                    },
                  ]}
                >
                  <Select
                    placeholder='Escribe para buscar ciudad'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleCitySearch}
                    onFocus={handleCityFocus}
                    loading={searchingCities}
                    notFoundContent={
                      searchingCities
                        ? 'Buscando ciudades...'
                        : 'Escribe para buscar ciudades'
                    }
                  >
                    {ClientsState.cities.value.map((city: any) => (
                      <Option key={city.uid} value={city.uid}>
                        {city.dianCode
                          ? `${city.dianCode} - ${city.name}`
                          : city.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={6}>
                <FormItem
                  name='phone1'
                  label='Teléfono 1'
                  rules={[
                    {
                      required: true,
                      message: 'El teléfono es requerido',
                    },
                    {
                      pattern: /^[\d\s\-\+\(\)]+$/,
                      message: 'Número de teléfono inválido',
                    },
                    { max: 20, message: 'Máximo 20 caracteres' },
                  ]}
                >
                  <Input placeholder='Teléfono principal' />
                </FormItem>
              </Col>

              <Col xs={24} sm={6}>
                <FormItem
                  name='phone2'
                  label='Teléfono 2'
                  rules={[
                    {
                      pattern: /^[\d\s\-\+\(\)]+$/,
                      message: 'Número de teléfono inválido',
                    },
                    { max: 20, message: 'Máximo 20 caracteres' },
                  ]}
                >
                  <Input placeholder='Teléfono secundario (opcional)' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name={CLIENT_FORM_FIELDS.email.value}
                  label='E-Mail'
                  rules={[
                    {
                      required: true,
                      message: 'El email es requerido',
                    },
                    { type: 'email', message: 'Ingresa un email válido' },
                    { max: 100, message: 'Máximo 100 caracteres' },
                  ]}
                >
                  <Input placeholder='correo@ejemplo.com' type='email' />
                </FormItem>
              </Col>
            </Row>

            <Row gutter={[12, 0]} style={{ marginTop: 24 }}>
              <Col xs={12} style={{ textAlign: 'left' }}>
                <Button onClick={handlePrev}>
                  Anterior
                </Button>
              </Col>
              <Col xs={12} style={{ textAlign: 'right' }}>
                <Button type='primary' onClick={handleNext}>
                  Siguiente
                </Button>
              </Col>
            </Row>
          </div>

          {/* Paso 2: Datos Laborales */}
          <div className='form-section' style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <Title level={5} className='section-title'>
              💼 Datos Laborales
            </Title>

            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <FormItem 
                  name='occupation' 
                  label='Ocupación'
                  rules={[
                    {
                      required: true,
                      message: 'La ocupación es requerida',
                    },
                  ]}
                >
                  <Input placeholder='Ocupación del cliente' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name={CLIENT_FORM_FIELDS.ciuCode.value} 
                  label='CIIU'
                  rules={[
                    {
                      required: true,
                      message: 'El código CIIU es requerido',
                    },
                  ]}
                >
                  <Select
                    placeholder='Escribe para buscar CIIU'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleCiuSearch}
                    onFocus={handleCiuFocus}
                    loading={searchingCius}
                    notFoundContent={
                      searchingCius
                        ? 'Buscando CIIUs...'
                        : 'Escribe para buscar CIIUs'
                    }
                  >
                    {ClientsState.cius.value.map((ciu: any) => (
                      <Option
                        key={ciu.uid}
                        value={ciu.uid}
                        diancode={ciu.dianCode}
                        description={ciu.description}
                      >
                        {ciu.dianCode} - {ciu.description}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='workCity' 
                  label='Ciudad'
                >
                  <Select
                    placeholder='Escribe para buscar ciudad de trabajo'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleCitySearch}
                    onFocus={handleCityFocus}
                    loading={searchingCities}
                    notFoundContent={
                      searchingCities
                        ? 'Buscando ciudades...'
                        : 'Escribe para buscar ciudades'
                    }
                  >
                    {ClientsState.cities.value.map((city: any) => (
                      <Option key={city.uid} value={city.uid}>
                        {city.dianCode
                          ? `${city.dianCode} - ${city.name}`
                          : city.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name={CLIENT_FORM_FIELDS.workCountry.value} 
                  label='País de Trabajo'
                  rules={[
                    {
                      required: true,
                      message: 'El país de trabajo es requerido',
                    },
                  ]}
                >
                  <Select
                    placeholder='Escribe para buscar país de trabajo'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleCountrySearch}
                    onFocus={handleCountryFocus}
                    loading={searchingCountries}
                    notFoundContent={
                      searchingCountries
                        ? 'Buscando...'
                        : ClientsState.countries.value.length === 0
                          ? 'Escribe para buscar países'
                          : 'No se encontraron resultados'
                    }
                  >
                    {ClientsState.countries.value.map((country: any) => (
                      <Option key={country.uid} value={country.uid}>
                        {country.dianCode
                          ? `${country.dianCode} - ${country.name}`
                          : country.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24}>
                <FormItem 
                  name='workAddress' 
                  label='Dirección Laboral'
                >
                  <TextArea
                    placeholder='Dirección de trabajo'
                    rows={2}
                    autoSize={{ minRows: 2, maxRows: 3 }}
                  />
                </FormItem>
              </Col>
            </Row>

            <Row gutter={[12, 0]} style={{ marginTop: 24 }}>
              <Col xs={12} style={{ textAlign: 'left' }}>
                <Button onClick={handlePrev}>
                  Anterior
                </Button>
              </Col>
              <Col xs={12} style={{ textAlign: 'right' }}>
                {isJuridica ? (
                  <Button type='primary' onClick={handleNext}>
                    Siguiente
                  </Button>
                ) : (
                  <Button 
                    type='primary' 
                    icon={<SaveOutlined />}
                    onClick={handleSubmit}
                    loading={ClientsState.loading.value}
                  >
                    {isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
                  </Button>
                )}
              </Col>
            </Row>
          </div>

          {/* Paso 3: Rep Legal y Composición Accionaria (SOLO PARA JURÍDICA) */}
          {isJuridica && (
          <div className='form-section' style={{ display: currentStep === 3 ? 'block' : 'none' }}>
            <Title level={5} className='section-title'>
              🏢 Representante Legal y Composición Accionaria
            </Title>

            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <FormItem label='Rep. Legal'>
                      {/* Mostrar campos de búsqueda solo si NO hay rep legal seleccionado/creado */}
                      {!repLegalCreatedName && !clientForm.getFieldValue('legalRepresentative') && (
                        <>
                          <Space.Compact style={{ width: '100%' }}>
                            <Select
                              placeholder='Tipo'
                              value={repLegalSearchType || undefined}
                              onChange={(value) => {
                                console.log('Tipo seleccionado:', value)
                                const selectedType = ClientsState.identificationTypes.value.find((t: any) => t.uid === value)
                                console.log('Objeto completo:', selectedType)
                                setRepLegalSearchType(value)
                                // Limpiar resultado anterior al cambiar tipo
                                setRepLegalNotFound(false)
                                setRepLegalUId(null)
                                clientForm.setFieldsValue({ legalRepresentative: undefined })
                              }}
                              showSearch
                              optionFilterProp='children'
                              filterOption={(input, option) =>
                                (option?.children?.toString().toLowerCase() || '').includes(input.toLowerCase())
                              }
                              style={{ width: '35%' }}
                            >
                              {ClientsState.identificationTypes.value.map((type: any) => {
                                const displayName = type.name || type.code || type.abbreviation || type.label || type.uid
                                return (
                                  <Option key={type.uid} value={type.uid}>
                                    {displayName}
                                  </Option>
                                )
                              })}
                            </Select>
                            <Input
                              placeholder='Número de identificación'
                              value={repLegalSearchNumber}
                              onChange={e => {
                                setRepLegalSearchNumber(e.target.value)
                                // Limpiar resultado anterior al cambiar número
                                setRepLegalNotFound(false)
                                setRepLegalUId(null)
                                clientForm.setFieldsValue({ legalRepresentative: undefined })
                              }}
                              onPressEnter={handleRepLegalSearch}
                              style={{ width: '45%' }}
                            />
                            <Button
                              type='primary'
                              icon={<SearchOutlined />}
                              onClick={handleRepLegalSearch}
                              loading={searchingRepLegal}
                            >
                              Buscar
                            </Button>
                          </Space.Compact>
                          {repLegalNotFound && (
                            <Button
                              type='dashed'
                              icon={<UserAddOutlined />}
                              onClick={handleOpenRepLegalModal}
                              block
                              style={{ marginTop: 8 }}
                            >
                              Crear Representante Legal
                            </Button>
                          )}
                        </>
                      )}

                      {/* Input bloqueado que muestra el representante legal seleccionado o creado */}
                      {(repLegalCreatedName || clientForm.getFieldValue('legalRepresentative')) && (
                        <div>
                          <Input 
                            value={repLegalCreatedName || clientForm.getFieldValue('legalRepresentative')}
                            disabled
                            style={{ 
                              backgroundColor: '#f6ffed',
                              borderColor: '#b7eb8f',
                              color: '#52c41a',
                              fontWeight: 'bold'
                            }}
                            prefix={<UserAddOutlined style={{ color: '#52c41a' }} />}
                          />
                          <Button 
                            type='link' 
                            size='small'
                            onClick={() => {
                              setRepLegalCreatedName(null)
                              setRepLegalUId(null)
                              setRepLegalSearchType('')
                              setRepLegalSearchNumber('')
                              clientForm.setFieldsValue({ legalRepresentative: undefined })
                            }}
                            style={{ padding: 0, marginTop: 4 }}
                          >
                            Cambiar representante legal
                          </Button>
                        </div>
                      )}

                      <FormItem name='legalRepresentative' hidden>
                        <Input />
                      </FormItem>
                    </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='subscribedCapital' 
                  label='Capital Suscrito'
                  rules={[
                    {
                      required: true,
                      message: 'El capital suscrito es requerido',
                    },
                  ]}
                >
                  <Input placeholder='Capital suscrito' />
                </FormItem>
              </Col>
            </Row>

            <Title level={5} className='section-title' style={{ marginTop: 24 }}>
              👥 Composición Accionaria
            </Title>

                <Form form={shareholderForm} layout='vertical'>
              <Row gutter={[12, 0]}>
                <Col xs={24} sm={8}>
                  <FormItem 
                    name='documentTypeUId' 
                    label='Tipo Documento'
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Select placeholder='Selecciona el tipo'>
                      {ClientsState.identificationTypes?.value?.map((type: any) => (
                        <Option key={type.uid} value={type.uid}>
                          {type.label || type.name}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>

                <Col xs={24} sm={8}>
                  <FormItem 
                    name='documentNumber' 
                    label='Número Documento'
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input placeholder='Ej: 1234567890' />
                  </FormItem>
                </Col>

                <Col xs={24} sm={8}>
                  <FormItem 
                    name='percentage' 
                    label='% Participación'
                    rules={[
                      { required: true, message: 'Campo requerido' }
                    ]}
                  >
                    <InputNumber 
                      placeholder='Ej: 50' 
                      min={0} 
                      max={100} 
                      controls={false}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value?.replace('%', '') as any}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem 
                    name='firstName' 
                    label='Primer Nombre'
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input placeholder='Primer nombre' />
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem name='secondName' label='Segundo Nombre'>
                    <Input placeholder='Segundo nombre (opcional)' />
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem 
                    name='firstSurname' 
                    label='Primer Apellido'
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input placeholder='Primer apellido' />
                  </FormItem>
                </Col>

                <Col xs={24} sm={12}>
                  <FormItem name='secondSurname' label='Segundo Apellido'>
                    <Input placeholder='Segundo apellido (opcional)' />
                  </FormItem>
                </Col>

                <Col xs={24} sm={6}>
                  <FormItem 
                    name='isPep' 
                    label='PEP o Familiar de PEP'
                    valuePropName='checked'
                    initialValue={false}
                    tooltip='Persona Expuesta Políticamente'
                  >
                    <Switch 
                      checkedChildren='Sí' 
                      unCheckedChildren='No' 
                      style={{ width: 'auto' }}
                    />
                  </FormItem>
                </Col>

                <Col xs={24}>
                  <Space>
                    <Button 
                      type='primary' 
                      icon={<MdAddCircle />} 
                      onClick={handleAddShareholder}
                      loading={checkingOfac}
                      disabled={ofacBlocked}
                    >
                      {checkingOfac ? 'Verificando OFAC...' : (editingShareholder !== null ? 'Actualizar' : 'Agregar')} Accionista
                    </Button>
                    {editingShareholder !== null && (
                      <Button onClick={handleCancelShareholder}>
                        Cancelar
                      </Button>
                    )}
                  </Space>
                </Col>
              </Row>
            </Form>

            {shareholders.length > 0 && (
              <Table
                dataSource={shareholders.map((sh, idx) => ({ ...sh, key: idx }))}
                pagination={false}
                style={{ marginTop: 16 }}
                columns={[
                  {
                    title: 'Tipo Doc',
                    dataIndex: 'documentTypeUId',
                    render: (uid) => {
                      const type = ClientsState.identificationTypes?.value?.find((t: any) => t.uid === uid)
                      return type?.label || type?.name || uid
                    }
                  },
                  {
                    title: 'Documento',
                    dataIndex: 'documentNumber',
                  },
                  {
                    title: 'Nombre Completo',
                    render: (_, record) => {
                      const parts = [
                        record.firstName,
                        record.secondName,
                        record.firstSurname,
                        record.secondSurname
                      ].filter(Boolean)
                      return parts.join(' ')
                    }
                  },
                  {
                    title: '%',
                    dataIndex: 'percentage',
                    render: (val) => `${val}%`
                  },
                  {
                    title: 'PEP',
                    dataIndex: 'isPep',
                    render: (val) => val ? 'Sí' : 'No'
                  },
                  {
                    title: 'Acciones',
                    render: (_, __, index) => (
                      <Space>
                        <Button 
                          icon={<EditOutlined />} 
                          size='small' 
                          onClick={() => handleEditShareholder(index)}
                        />
                        <Button 
                          icon={<DeleteOutlined />} 
                          size='small' 
                          danger 
                          onClick={() => handleDeleteShareholder(index)}
                        />
                      </Space>
                    )
                  }
                ]}
              />
            )}

                {shareholders.length === 0 && (
                  <Alert
                    message="Composición Accionaria Requerida"
                    description="Debes agregar al menos un accionista para poder guardar el cliente jurídico."
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}

            {ofacBlocked && (
              <Alert
                message="⛔ ALERTA OFAC - PROCESO BLOQUEADO"
                description={`El accionista "${ofacBlockedPerson}" se encuentra en la lista OFAC (Office of Foreign Assets Control). No se puede continuar con la creación de este cliente. Elimine al accionista y verifique la información.`}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
                closable
                onClose={() => {
                  setOfacBlocked(false)
                  setOfacBlockedPerson(null)
                }}
              />
            )}

            <Row gutter={[12, 0]} style={{ marginTop: 24 }}>
              <Col xs={12} style={{ textAlign: 'left' }}>
                <Button onClick={handlePrev}>
                  Anterior
                </Button>
              </Col>
              <Col xs={12} style={{ textAlign: 'right' }}>
                <Button 
                  type='primary' 
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={ClientsState.loading.value}
                  disabled={shareholders.length === 0 || ofacBlocked}
                >
                  {isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
                </Button>
              </Col>
            </Row>
          </div>
          )}
        </Form>
      </div>

      {/* Modal para crear Representante Legal */}
      <Modal
        title='Crear Representante Legal'
        open={showRepLegalModal}
        onCancel={handleCloseRepLegalModal}
        width={800}
        centered
        footer={[
          <Button
            key='back'
            onClick={handleRepLegalModalPrev}
            disabled={repLegalModalStep === 0}
          >
            Anterior
          </Button>,
          repLegalModalStep < 2 ? (
            <Button key='next' type='primary' onClick={handleRepLegalModalNext}>
              Siguiente
            </Button>
          ) : (
            <Button 
              key='submit' 
              type='primary' 
              onClick={handleSaveRepLegal}
              loading={ClientsState.loading.value}
            >
              Crear Representante
            </Button>
          ),
        ]}
      >
        <Steps
          current={repLegalModalStep}
          style={{ marginBottom: 24 }}
          items={[
            { title: 'Datos Personales' },
            { title: 'Datos de Residencia' },
            { title: 'Datos Adicionales' },
          ]}
        />

        <Form 
          form={repLegalForm} 
          layout='vertical'
          preserve={true}
          onValuesChange={(changedValues, allValues) => {
            const nameFields = ['firstName', 'secondName', 'firstSurname', 'secondSurname']
            const hasNameFieldChanged = Object.keys(changedValues).some((key) =>
              nameFields.includes(key)
            )

            if (hasNameFieldChanged) {
              const fullName = [
                allValues.firstName,
                allValues.secondName,
                allValues.firstSurname,
                allValues.secondSurname,
              ]
                .filter(Boolean)
                .join(' ')

              repLegalForm.setFieldsValue({ fullName })
            }
          }}
        >
          {/* Paso 0: Datos Personales */}
          {repLegalModalStep === 0 && (
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormItem
                  name='identificationType'
                  label='Tipo Documento'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Select 
                    placeholder='Selecciona el tipo'
                    showSearch
                    optionFilterProp='children'
                  >
                    {ClientsState.identificationTypes?.value?.map((type: any) => (
                      <Option key={type.uid} value={type.uid}>
                        {type.label || type.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='personType'
                  label='Tipo Contribuyente'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                  initialValue={ClientsState.personTypes.value.find((type: any) => type.name === 'Natural')?.uid}
                >
                  <Select placeholder='Natural' showSearch disabled>
                    {ClientsState.personTypes.value.map((type: any) => (
                        <Option key={type.uid} value={type.uid}>
                          {type.name}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='identificationNumber'
                  label='Identificación'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Input placeholder='Ej: 1234567890' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='isPep'
                  label='PEP o Familiar de PEP'
                  valuePropName='checked'
                  tooltip='Persona Expuesta Políticamente'
                >
                  <Switch 
                    checkedChildren='Sí' 
                    unCheckedChildren='No' 
                    style={{ width: 'auto' }}
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='firstSurname'
                  label='Primer Apellido'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Input placeholder='Ingrese el primer apellido' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem name='secondSurname' label='Segundo Apellido'>
                  <Input placeholder='Ingrese el segundo apellido (opcional)' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='firstName'
                  label='Primer Nombre'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Input placeholder='Ingrese el primer nombre' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem name='secondName' label='Segundo Nombre'>
                  <Input placeholder='Ingrese el segundo nombre (opcional)' />
                </FormItem>
              </Col>

              <Col xs={24}>
                <FormItem name='fullName' label='Nombre Completo'>
                  <Input placeholder='Nombre completo del cliente' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='birthDate' 
                  label='Fecha Nacimiento'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <DatePicker
                    format='YYYY-MM-DD'
                    style={{ width: '100%' }}
                    placeholder='Selecciona fecha'
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem
                  name='nationality'
                  label='Nacionalidad'
                >
                  <Select
                    showSearch
                    placeholder='Selecciona un país'
                    optionFilterProp='children'
                    filterOption={(input, option) => {
                      const countryName =
                        option?.children?.toString().toLowerCase() || ''
                      return countryName.includes(input.toLowerCase())
                    }}
                  >
                    {ClientsState.countries?.value?.map((country: any) => (
                      <Option key={country.uid} value={country.uid}>
                        {country.dianCode
                          ? `${country.dianCode} - ${country.name}`
                          : country.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          )}

          {/* Paso 1: Datos de Residencia */}
          {repLegalModalStep === 1 && (
            <Row gutter={16}>
              <Col xs={24}>
                <FormItem 
                  name='address' 
                  label='Dirección'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <LocationAutoComplete
                    placeholder='Selecciona o escribe la dirección de residencia'
                    onLocationSelect={(locationData: any) => {
                      if (locationData) {
                        repLegalForm.setFieldsValue({
                          address: locationData.address,
                        })
                      }
                    }}
                  />
                </FormItem>
              </Col>

              <Col xs={24} sm={8}>
                <FormItem 
                  name='cityUId' 
                  label='Ciudad'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Select
                    placeholder='Escribe para buscar ciudad'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleModalCitySearch}
                    loading={searchingModalCities}
                    notFoundContent={
                      searchingModalCities
                        ? 'Buscando ciudades...'
                        : 'Escribe para buscar ciudades'
                    }
                  >
                    {modalCities.map((city: any) => (
                      <Option key={city.uid} value={city.uid}>
                        {city.dianCode
                          ? `${city.dianCode} - ${city.name}`
                          : city.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={8}>
                <FormItem 
                  name='phone1' 
                  label='Celular'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Input placeholder='Número de celular' />
                </FormItem>
              </Col>

              <Col xs={24} sm={8}>
                <FormItem name='phone2' label='Teléfono 2'>
                  <Input placeholder='Teléfono secundario (opcional)' />
                </FormItem>
              </Col>

              <Col xs={24}>
                <FormItem 
                  name='email' 
                  label='E-Mail'
                  rules={[
                    { required: true, message: 'Campo requerido' },
                    { type: 'email', message: 'Correo inválido' }
                  ]}
                >
                  <Input placeholder='correo@ejemplo.com' />
                </FormItem>
              </Col>
            </Row>
          )}

          {/* Paso 2: Datos Adicionales */}
          {repLegalModalStep === 2 && (
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <FormItem 
                  name='occupation' 
                  label='Ocupación'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Input placeholder='Ocupación del cliente' />
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='ciuCode' 
                  label='CIIU'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Select
                    placeholder='Escribe para buscar CIIU'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleModalCiuSearch}
                    loading={searchingModalCius}
                    notFoundContent={
                      searchingModalCius
                        ? 'Buscando CIIUs...'
                        : 'Escribe para buscar CIIUs'
                    }
                  >
                    {modalCius.map((ciu: any) => (
                      <Option
                        key={ciu.uid}
                        value={ciu.uid}
                        diancode={ciu.dianCode}
                        description={ciu.description}
                      >
                        {ciu.dianCode} - {ciu.description}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='workCity' 
                  label='Ciudad'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Select
                    placeholder='Escribe para buscar ciudad de trabajo'
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleModalCitySearch}
                    loading={searchingModalCities}
                    notFoundContent={
                      searchingModalCities
                        ? 'Buscando ciudades...'
                        : 'Escribe para buscar ciudades'
                    }
                  >
                    {modalCities.map((city: any) => (
                      <Option key={city.uid} value={city.uid}>
                        {city.dianCode
                          ? `${city.dianCode} - ${city.name}`
                          : city.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24} sm={12}>
                <FormItem 
                  name='workCountry' 
                  label='País de Trabajo'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Select
                    showSearch
                    placeholder='Selecciona un país'
                    optionFilterProp='children'
                    filterOption={(input, option) => {
                      const countryName =
                        option?.children?.toString().toLowerCase() || ''
                      return countryName.includes(input.toLowerCase())
                    }}
                  >
                    {ClientsState.countries?.value?.map((country: any) => (
                      <Option key={country.uid} value={country.uid}>
                        {country.dianCode
                          ? `${country.dianCode} - ${country.name}`
                          : country.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col xs={24}>
                <FormItem 
                  name='workAddress' 
                  label='Dirección Laboral'
                  rules={[{ required: true, message: 'Campo requerido' }]}
                >
                  <Input placeholder='Dirección de trabajo' />
                </FormItem>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </Drawer>
  )
}

export default ClientsFormDrawer
