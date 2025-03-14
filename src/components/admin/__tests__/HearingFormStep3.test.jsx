import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';

import HearingFormStep3 from '../HearingFormStep3';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const storeInitialState = { accessibility: { isHighContrast: false } };

const renderComponent = (propOverrides, storeOverride) => {
  const { mockHearingWithSections } = mockData;

  const props = {
    hearing: mockHearingWithSections,
    language: 'fi',
    onHearingChange: vi.fn(),
    onCreateMapMarker: vi.fn(),
    onAddMapMarker: vi.fn(),
    onAddMapMarkersToCollection: vi.fn(),
    onContinue: vi.fn(),
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<HearingFormStep3 {...props} />, { store });
};

describe('<HearingFormStep3 />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should call onContinue when the continue button is clicked', () => {
    const onContinueMock = vi.fn();

    renderComponent({ onContinue: onContinueMock });

    const continueButton = screen.getByText('hearingFormNext');

    fireEvent.click(continueButton);

    expect(onContinueMock).toHaveBeenCalled();
  });
});
