import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { UnconnectedHearingFormStep3 } from '../HearingFormStep3';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    hearing: {},
    onHearingChange: () => {},
    onAddMapMarker: () => {},
    onAddMapMarkersToCollection: () => {},
    onCreateMapMarker: () => {},
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <UnconnectedHearingFormStep3 {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingFormStep3 />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });
});
