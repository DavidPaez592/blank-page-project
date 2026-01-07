import { FC, ReactNode } from 'react'
import { SiAdblock } from 'react-icons/si'

import { useCheckAccess } from '@/hooks/useAuth'

import './index.scss'

interface ICheckAccessProps {
  permission: string | string[]
  children: ReactNode
  message?: string
}

/**
 * CheckAccess component
 *
 * This component checks if the user has the required permissions to access the wrapped content.
 * If the user has access, it renders the children components. If the user does not have access,
 * it displays an optional message or nothing.
 *
 * @component
 * @example
 * <CheckAccess permission="admin" message="No tienes acceso a esta sección">
 *   <AdminPanel />
 * </CheckAccess>
 *
 * @param {object} props - The props passed to the component.
 * @param {string | string[]} props.permission - The required permission(s) to access the content.
 * @param {ReactNode} props.children - The child components to be conditionally rendered.
 * @param {string} [props.message] - An optional message to display if the user does not have access.
 *
 * @returns {JSX.Element | null} The rendered component or null if the user does not have access and no message is provided.
 */
export const CheckAccess: FC<ICheckAccessProps> = ({
  permission,
  children,
  message,
}: {
  permission: string | string[]
  children: ReactNode
  message?: string
}): JSX.Element | null => {
  const { hasAccess } = useCheckAccess(permission)

  if (hasAccess.value) return <>{children}</>

  if (message) {
    return (
      <div className='check-access-message'>
        <SiAdblock />
        <div className='message'>{message}</div>
      </div>
    )
  }

  return null
}
