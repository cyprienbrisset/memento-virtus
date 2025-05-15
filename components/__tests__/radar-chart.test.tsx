import { render, screen } from '@testing-library/react'
import { RadarChart } from '../radar-chart'

// Mock complet de D3 en utilisant la technique de mise en place d'un objet avec des fonctions vides
jest.mock('d3', () => {
  // Créer une fonction de mock qui peut être chaînée indéfiniment
  const chainableMock = () => {
    const mock = jest.fn();
    mock.mockReturnValue(mock);
    return mock;
  };

  return {
    select: jest.fn(() => chainableMock()),
    selectAll: chainableMock(),
    scalePoint: jest.fn(() => chainableMock()),
    scaleLinear: jest.fn(() => chainableMock()),
    lineRadial: jest.fn(() => chainableMock()),
    scaleOrdinal: jest.fn(() => jest.fn()),
    curveLinearClosed: {},
    schemeCategory10: []
  };
});

// Mock de l'élément SVG
HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 400,
  height: 400,
  top: 0,
  left: 0,
  right: 400,
  bottom: 400
}));

describe('RadarChart', () => {
  const mockData = [
    {
      date: '2024-01-01',
      value1: 3,
      value2: 4,
      value3: 2,
    },
    {
      date: '2024-02-01',
      value1: 4,
      value2: 3,
      value3: 5,
    },
  ]

  const mockKeys = ['value1', 'value2', 'value3']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RadarChart data={mockData} keys={mockKeys} />)
    const svg = screen.getByTestId('radar-chart')
    expect(svg).toBeInTheDocument()
  })

  it('handles empty data', () => {
    render(<RadarChart data={[]} keys={mockKeys} />)
    const svg = screen.getByTestId('radar-chart')
    expect(svg).toBeInTheDocument()
  })

  it('handles empty keys', () => {
    render(<RadarChart data={mockData} keys={[]} />)
    const svg = screen.getByTestId('radar-chart')
    expect(svg).toBeInTheDocument()
  })

  it('renders with correct dimensions', () => {
    render(<RadarChart data={mockData} keys={mockKeys} />)
    const svg = screen.getByTestId('radar-chart')
    expect(svg).toHaveAttribute('width', '400')
    expect(svg).toHaveAttribute('height', '400')
  })

  it('initializes D3 scales correctly', () => {
    render(<RadarChart data={mockData} keys={mockKeys} />)
    // Vérifie que les échelles sont initialisées avec les bonnes données
    expect(d3.scalePoint).toHaveBeenCalled()
    expect(d3.scaleLinear).toHaveBeenCalled()
  })

  it('creates correct number of data paths', () => {
    render(<RadarChart data={mockData} keys={mockKeys} />)
    // Vérifie que le nombre de chemins correspond au nombre de données
    expect(d3.lineRadial).toHaveBeenCalledTimes(mockData.length)
  })
}) 