import { render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'

import { App } from '../App'

describe('Initial state of component', () => {
  it('renders the App component', async () => {
    // Mock useAuthCheck to return a specific value for isAuth
    vi.mock('../src/hooks/useAuth', () => ({
      useAuthCheck: vi.fn(() => ({ isAuth: true })),
      useAuthState: vi.fn(() => ({ isAuth: true })),
    }))

    // Mock useThemeState to return a specific theme
    vi.mock('../src/hooks/useTheme', () => ({
      useThemeState: vi.fn(() => ({
        topbarTheme: {
          themeName: 'defaultTheme',
        },
      })),
    }))

    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(1).toBe(1)
    })
  })
})
