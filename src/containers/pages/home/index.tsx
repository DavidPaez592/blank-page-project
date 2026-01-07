import { Card, Steps, Typography } from 'antd'
import './index.scss'

export const HomePage: React.FC = (): JSX.Element => {
  const { Title, Paragraph } = Typography

  return (
    <section className='page-main home'>
      <Title level={1} className='home__title'>
        Página de inicio
      </Title>
      <Paragraph className='home__lead'>
        Esta es la página de inicio de la aplicación.
      </Paragraph>
      <Paragraph>
        Puedes extender esta página para incluir información adicional, como
        actividad reciente, enlaces rápidos e información específica del
        usuario.
      </Paragraph>
      <Card className='home__card' title='Nuevas páginas · rutas'>
        <Steps
          direction='vertical'
          size='small'
          items={[
            {
              title: 'Semillas',
              description:
                'Agrega nuevas rutas desde las semillas en el backend: "menu-items", "permissions", "routes"',
            },
            {
              title: 'Crea una nueva página',
              description:
                'Lo puedes hacer en la carpeta: "src/containers/pages"',
            },
            {
              title: 'Rutas',
              description:
                'Agrega tus páginas a las rutas: "src/router/routes.tsx"',
            },
          ]}
        />
      </Card>
    </section>
  )
}

export default HomePage
