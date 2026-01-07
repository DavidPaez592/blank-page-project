import nprogress from 'nprogress'
import { useEffect } from 'react'

import logo from '@/assets/images/logoAzul.png'

import './index.scss'

/**
 * LazyLoad component
 *
 * This component displays a loading indicator using nprogress and a logo image.
 * It starts the nprogress indicator when the component mounts and stops it when the component unmounts.
 *
 * @returns {JSX.Element} The rendered component
 */
export const LazyLoad: React.FunctionComponent = (): JSX.Element => {
  useEffect(() => {
    nprogress.start()

    return () => {
      nprogress.done()
    }
  }, [])

  return (
    <div className='lazy-load'>
      <img alt='logo' src={logo} style={{ maxHeight: '55px' }} />
    </div>
  )
}

export default LazyLoad
