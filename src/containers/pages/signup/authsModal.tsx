import { AuthState } from '@/state'
import { Modal } from 'antd'

export type TSignupAuthsModal = {
  handleConfirm: () => void
  handleCancel: () => void
}

export default function SignupAuthsModal(props: TSignupAuthsModal) {
  if (!AuthState.authModal.value.data) return null

  return (
    <Modal
      className='signup-auth-modal'
      open={AuthState.authModal.value.open}
      title={AuthState.authModal.value.data.title}
      destroyOnClose
      maskClosable={false}
      okText='Acepto'
      cancelText='Cancelar'
      onOk={props.handleConfirm}
      onCancel={props.handleCancel}
    >
      {AuthState.authModal.value.data.text}
    </Modal>
  )
}
