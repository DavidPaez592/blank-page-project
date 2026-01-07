import { Popover } from 'antd'
import { useCallback } from 'react'

import USER_PIC from '@/assets/images/user1.png'
import { useAuth } from '@/hooks/useAuth'

export const TopbarUser: React.FC = () => {
  const { handleLogout } = useAuth()

  const handleClose = useCallback(() => {
    handleLogout()
  }, [handleLogout])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleClose()
      }
    },
    [handleClose]
  )

  const content = (
    <button
      className='isoDropdownLink'
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      Cerrar
    </button>
  )

  return (
    <Popover content={content} placement='bottomLeft' trigger='click'>
      <button className='isoImgWrapper' onKeyDown={handleKeyDown}>
        <img alt='user' src={USER_PIC} />
        <span className='userActivity online' />
      </button>
    </Popover>
  )
}
