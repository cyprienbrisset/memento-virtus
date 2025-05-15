import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme-provider'

// Créer un mock qui sera utilisé par le test
const mockThemeProviderComponent = jest.fn(({ children }) => <div data-testid="theme-provider">{children}</div>);

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: (props) => mockThemeProviderComponent(props)
}))

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('passes props to NextThemesProvider', () => {
    const testProps = {
      attribute: 'data-theme',
      defaultTheme: 'dark',
      enableSystem: true
    }

    render(
      <ThemeProvider {...testProps}>
        <div>Test Child</div>
      </ThemeProvider>
    )

    // Vérifier que le mock a été appelé avec les bonnes props
    expect(mockThemeProviderComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'data-theme',
        defaultTheme: 'dark',
        enableSystem: true,
        children: expect.anything()
      })
    )
  })

  it('handles undefined props gracefully', () => {
    render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })
}) 