import React, { useEffect, useMemo } from 'react'
import { Drawer, FloatButton, Form, Typography, Divider } from 'antd'
import { MdAddCircle } from 'react-icons/md'
import { GrUpdate } from 'react-icons/gr'

import { useLocations } from '@/hooks/useLocations'
import LocationForm from '../form'

import './form.scss'

const { Title, Text } = Typography

/**
 * LocationsFormDrawer component
 *
 * This component renders a drawer containing a form for creating or updating a location.
 * It includes fields for location details and handles form submission.
 *
 * @returns {JSX.Element} The rendered component
 */
export const LocationsFormDrawer: React.FC = (): JSX.Element => {
  const [locationForm] = Form.useForm()
  const {
    openDrawer,
    currentLocation,
    loading,
    handleCreateLocation,
    handleUpdateLocation,
    handleCloseDrawer,
  } = useLocations()

  const editMode = useMemo(
    () => Boolean(currentLocation.value.uid),
    [currentLocation.value.uid]
  )

  const { drawerTitle, buttonIcon, buttonTooltip } = useMemo(() => {
    if (editMode) {
      return {
        drawerTitle: 'Editar Ubicación',
        buttonIcon: <GrUpdate />,
        buttonTooltip: 'Actualizar Ubicación',
      }
    }

    return {
      drawerTitle: 'Nueva Ubicación',
      buttonIcon: <MdAddCircle />,
      buttonTooltip: 'Crear Ubicación',
    }
  }, [editMode])

  const handleSubmit = async () => {
    try {
      const values = await locationForm.validateFields()

      if (editMode && currentLocation.value.uid) {
        await handleUpdateLocation({
          uid: currentLocation.value.uid,
          ...values,
        })
      } else {
        await handleCreateLocation(values)
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (openDrawer.value && currentLocation.value) {
      locationForm.setFieldsValue({
        name: currentLocation.value.name || '',
        address: currentLocation.value.address || '',
        cityUId: currentLocation.value.cityUId || undefined,
        additionalDetails: currentLocation.value.additionalDetails || '',
      })
    }
  }, [currentLocation.value, openDrawer.value, locationForm])

  useEffect(() => {
    if (!openDrawer.value) {
      locationForm.resetFields()
    }
  }, [openDrawer.value, locationForm])

  return (
    <Drawer
      title={
        <div className='drawer-header'>
          <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
            {drawerTitle}
          </Title>
          <Text type='secondary'>
            {editMode
              ? 'Modifica los datos de la ubicación'
              : 'Completa la información de la nueva ubicación'}
          </Text>
        </div>
      }
      placement='right'
      width={520}
      onClose={handleCloseDrawer}
      open={openDrawer.value}
      className='locations-form-drawer'
      destroyOnClose
      maskClosable={false}
      style={{ overflow: 'hidden' }}
    >
      <div className='drawer-content'>
        <div className='form-section'>
          <Title level={5} className='section-title'>
            Información de la Ubicación
          </Title>
          <LocationForm form={locationForm} />
        </div>

        <FloatButton
          icon={buttonIcon}
          type='primary'
          tooltip={{ title: buttonTooltip, placement: 'left' }}
          onClick={handleSubmit}
          className='submit-button'
          style={{
            position: 'fixed',
            right: 40,
            bottom: 24,
            zIndex: 1000,
          }}
        />
      </div>
    </Drawer>
  )
}

export default LocationsFormDrawer
