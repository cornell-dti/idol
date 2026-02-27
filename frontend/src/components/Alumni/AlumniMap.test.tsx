import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AlumniMap from './AlumniMap';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, eventHandlers }: any) => (
    <div data-testid="marker" onClick={eventHandlers?.click}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  )
}));

jest.mock('leaflet', () => ({
  Icon: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>
  };
});

const mockCityCoordinates: CityCoordinates[] = [
  {
    locationName: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    alumniIds: ['1', '3']
  },
  {
    locationName: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.006,
    alumniIds: ['2']
  }
];

describe('<AlumniMap />', () => {
  const mockOnCitySelect = jest.fn();
  const mockOnCityDeselect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it should render the map container', () => {
    render(
      <AlumniMap
        visibleCityCoordinates={mockCityCoordinates}
        selectedCityCoordinates={[]}
        onCitySelect={mockOnCitySelect}
        onCityDeselect={mockOnCityDeselect}
      />
    );

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('it should render markers for all visible city coordinates', () => {
    render(
      <AlumniMap
        visibleCityCoordinates={mockCityCoordinates}
        selectedCityCoordinates={[]}
        onCitySelect={mockOnCitySelect}
        onCityDeselect={mockOnCityDeselect}
      />
    );

    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
  });

  test('it should display city name and alumni count in popup', () => {
    render(
      <AlumniMap
        visibleCityCoordinates={mockCityCoordinates}
        selectedCityCoordinates={[]}
        onCitySelect={mockOnCitySelect}
        onCityDeselect={mockOnCityDeselect}
      />
    );

    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('2 alumni')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('1 alumnus')).toBeInTheDocument();
  });

  test('it should call onCitySelect when clicking an unselected pin', () => {
    render(
      <AlumniMap
        visibleCityCoordinates={mockCityCoordinates}
        selectedCityCoordinates={[]}
        onCitySelect={mockOnCitySelect}
        onCityDeselect={mockOnCityDeselect}
      />
    );

    const markers = screen.getAllByTestId('marker');
    fireEvent.click(markers[0]);

    expect(mockOnCitySelect).toHaveBeenCalledWith(mockCityCoordinates[0]);
    expect(mockOnCityDeselect).not.toHaveBeenCalled();
  });

  test('it should call onCityDeselect when clicking a selected pin', () => {
    render(
      <AlumniMap
        visibleCityCoordinates={mockCityCoordinates}
        selectedCityCoordinates={[mockCityCoordinates[0]]}
        onCitySelect={mockOnCitySelect}
        onCityDeselect={mockOnCityDeselect}
      />
    );

    const markers = screen.getAllByTestId('marker');
    fireEvent.click(markers[0]);

    expect(mockOnCityDeselect).toHaveBeenCalledWith(mockCityCoordinates[0]);
    expect(mockOnCitySelect).not.toHaveBeenCalled();
  });

  test('it should handle empty city coordinates', () => {
    render(
      <AlumniMap
        visibleCityCoordinates={[]}
        selectedCityCoordinates={[]}
        onCitySelect={mockOnCitySelect}
        onCityDeselect={mockOnCityDeselect}
      />
    );

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });
});
