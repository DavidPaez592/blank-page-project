import { useComputed, useSignal } from '@preact/signals-react'
import { Form, FormInstance, Input, Select, notification } from 'antd'
import { useEffect, useState } from 'react'

import { LOCATION_FORM_FIELDS } from '@/constants'
import { LocationsState } from '@/state/locations'
import { ClientsState } from '@/state'
import { clientsStateActions } from '@/state/clients/actions'
import { addressValidator } from '@/helpers/addressValidation'

import './index.scss'

/**
 * LocationForm component
 *
 * This component renders a form for creating or editing a location. It includes fields for the location code,
 * name, address, city, and additional details.
 *
 * @param {object} props - The props passed to the component.
 * @param {FormInstance} props.form - The Ant Design form instance.
 * @returns {JSX.Element} The rendered component
 */
export const LocationForm: React.FC<{ form: FormInstance }> = ({
  form,
}: {
  form: FormInstance
}): JSX.Element => {
  const isDisabled = useComputed(() =>
    Boolean(
      !LocationsState.currentLocation.value.modifiable &&
        LocationsState.currentLocation.value.id
    )
  )

  const [searchingCities, setSearchingCities] = useState(false)
  const [citySearchTimeout, setCitySearchTimeout] =
    useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (citySearchTimeout) {
        clearTimeout(citySearchTimeout)
      }
      ClientsState.cities.value = []
    }
  }, [])

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

  const cityOptions = ClientsState.cities.value.map((city: any) => ({
    label: `${city.name} - ${city.departmentName || 'N/A'}`,
    value: city.uid,
  }))

  return (
    <Form
      disabled={isDisabled.value}
      className='location-form'
      layout='vertical'
      form={form}
      requiredMark={false}
      size='large'
    >
      <Form.Item
        name={LOCATION_FORM_FIELDS.name.value}
        label={LOCATION_FORM_FIELDS.name.label}
        rules={[
          {
            required: true,
            message: 'El nombre es requerido',
          },
          {
            min: 2,
            message: 'El nombre debe tener al menos 2 caracteres',
          },
          {
            max: 200,
            message: 'El nombre no puede exceder 200 caracteres',
          },
        ]}
      >
        <Input placeholder='Ej: Oficina Principal' showCount maxLength={200} />
      </Form.Item>

      <Form.Item
        name={LOCATION_FORM_FIELDS.address.value}
        label={LOCATION_FORM_FIELDS.address.label}
        rules={[
          {
            required: true,
            message: 'La dirección es requerida',
          },
          {
            max: 500,
            message: 'La dirección no puede exceder 500 caracteres',
          },
          addressValidator(),
        ]}
        tooltip='Formato válido: Calle 123 #45-67, Carrera 7 #32-16'
      >
        <Input.TextArea
          placeholder='Ej: Calle 123 #45-67'
          showCount
          maxLength={500}
          rows={2}
        />
      </Form.Item>

      <Form.Item
        name={LOCATION_FORM_FIELDS.cityUId.value}
        label={LOCATION_FORM_FIELDS.cityUId.label}
        rules={[
          {
            required: true,
            message: 'La ciudad es requerida',
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
          options={cityOptions}
        />
      </Form.Item>

      <Form.Item
        name={LOCATION_FORM_FIELDS.additionalDetails.value}
        label={LOCATION_FORM_FIELDS.additionalDetails.label}
      >
        <Input.TextArea
          placeholder='Información adicional sobre la ubicación'
          rows={3}
          maxLength={1000}
          showCount
        />
      </Form.Item>
    </Form>
  )
}

export default LocationForm
