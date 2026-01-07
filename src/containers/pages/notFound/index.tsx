import { Link } from 'react-router-dom'

import './index.scss'

export const NotFoundPage: React.FC = () => {
  return (
    <div className='not-found-page'>
      <h1>404</h1>

      <p>Lo sentimos, la página que estás buscando no existe.</p>

      <Link to='/'>Volver a Inicio</Link>
    </div>
  )
}
