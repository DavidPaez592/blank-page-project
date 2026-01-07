import { AuthState } from '@/state'
import { useComputed } from '@preact/signals-react'

import USER_PIC from '@/assets/images/user1.png'

import './index.scss'

/**
 * ProfilePage component
 *
 * This component renders the profile page of the application. It includes user information,
 * profile picture, and can be extended to include additional features such as user details,
 * recent activity, and settings.
 *
 * @returns {JSX.Element} The rendered component
 */
export const ProfilePage: React.FC = (): JSX.Element => {
  const userData = useComputed(() => {
    const {
      firstName,
      firstSurname,
      roles,
      email,
      phoneMobile,
      birthdate,
      role,
    } = AuthState.currentUser.value
    const currentRoleId = AuthState.currentRole.value

    return {
      fullName: `${firstName} ${firstSurname}`,
      currentRole: roles?.find((item) => item.uid === currentRoleId)?.name,
      email: email,
      phoneMobile: phoneMobile,
      birthdate: birthdate,
      role: role,
    }
  })

  return (
    <div className='profile-page'>
      <img src={USER_PIC} alt='User Profile' className='profile-pic' />

      <h1 className='full-name'>{userData.value.fullName}</h1>

      <section className='user-details'>
        <span>
          <strong>Email:</strong>
        </span>

        <span>{userData.value.email}</span>

        <span>
          <strong>Teléfono:</strong>
        </span>

        <span>{userData.value.phoneMobile}</span>

        {/* 
        TODO: Uncomment this section when the user's birthdate is available

        <span>
          <strong>Dirección:</strong>
        </span>

        <span>Calle Falsa 123, Madrid, España</span> */}

        {/* 
        TODO: Uncomment this section when the user's role is available
        <span>
          <strong>Cargo:</strong>
        </span>

        <span>Full-Stack Developer</span> */}

        <span>
          <strong>Role actual:</strong>
        </span>

        <span>{userData.value.currentRole}</span>
      </section>
    </div>
  )
}

export default ProfilePage
