import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'
import { AiOutlineCloseCircle } from 'react-icons/ai'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = {
      hasError: false,
    }

    this.handleResetError = this.handleResetError.bind(this)
  }

  public static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch = (error: Error, errorInfo: ErrorInfo): void => {
    consoleLog.error('Uncaught error', error)
  }

  private readonly handleResetError = (): void => {
    this.setState({ hasError: false })
  }

  render = (): React.ReactNode => {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'grid',
            gap: '20px',
            alignContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <AiOutlineCloseCircle
            style={{
              justifySelf: 'center',
              width: '175px',
              height: '175px',
            }}
          />

          <h2 style={{ margin: '0' }}>Algo salio mal.</h2>

          <p
            style={{
              margin: '0',
            }}
          >
            Por favor intenta de nuevo más tarde o contacta a soporte si el
            error persiste
          </p>

          <Link
            to='/'
            onClick={this.handleResetError}
            style={{
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            Volver al inicio
          </Link>
        </div>
      )
    }

    return this.props.children
  }
}
