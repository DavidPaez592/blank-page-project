import React, { useEffect, useState } from 'react'
import { AutoComplete } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

import { LocationsState } from '@/state/locations'
import { locationsStateActions } from '@/state/actions'

import './index.scss'

interface LocationAutoCompleteProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  onLocationSelect?: (cityUId: string | undefined, cityName?: string) => void
}

export const LocationAutoComplete: React.FC<LocationAutoCompleteProps> = ({
  value,
  onChange,
  placeholder = 'Escribe o selecciona una dirección',
  disabled = false,
  maxLength = 200,
  onLocationSelect,
}) => {
  const [searchValue, setSearchValue] = useState<string>(value || '')
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  )

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      LocationsState.locations.value = []
    }
  }, [])

  useEffect(() => {
    setSearchValue(value || '')
  }, [value])

  const options = LocationsState.locations.value
    .filter((location) => location.address && location.name)
    .map((location) => {
      const cityName = location.city?.name || ''

      return {
        value: location.address,
        label: (
          <div className='location-option'>
            <div className='location-option-main'>
              <EnvironmentOutlined className='location-icon' />
              <span className='location-address'>{location.address}</span>
            </div>
            <div className='location-option-meta'>
              <span className='location-name'>{location.name}</span>
              {cityName && <span className='location-code'>• {cityName}</span>}
            </div>
          </div>
        ),
        searchText: `${location.address} ${location.name}`.toLowerCase(),
      }
    })

  const handleSearch = async (searchText: string) => {
    setSearchValue(searchText)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (!searchText || searchText.length < 2) {
      if (!searchText) {
        LocationsState.locations.value = []
      }
      return
    }

    setLoadingLocations(true)

    const timeout = setTimeout(async () => {
      try {
        await locationsStateActions.getAllLocations(searchText)
      } catch (error) {
      } finally {
        setLoadingLocations(false)
      }
    }, 500)

    setSearchTimeout(timeout)
  }

  const handleSelect = (selectedValue: string) => {
    setSearchValue(selectedValue)
    onChange?.(selectedValue)

    const selectedLocation = LocationsState.locations.value.find(
      (location) => location.address === selectedValue
    )

    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation.cityUId, selectedLocation.city?.name)
    }
  }

  const handleChange = (newValue: string) => {
    setSearchValue(newValue)
    onChange?.(newValue)
  }

  const filterOption = () => {
    return true
  }

  return (
    <AutoComplete
      value={searchValue}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className='location-autocomplete'
      filterOption={filterOption}
      allowClear
      style={{ width: '100%' }}
      notFoundContent={
        loadingLocations
          ? 'Buscando ubicaciones...'
          : 'Escribe para buscar ubicaciones frecuentes'
      }
    />
  )
}

export default LocationAutoComplete
