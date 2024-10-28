import React from 'react';

import { UnconnectedHearingFormStep3 } from '../HearingFormStep3';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    hearing: {},
    onHearingChange: () => {},
    onAddMapMarker: () => {},
    onAddMapMarkersToCollection: () => {},
    onCreateMapMarker: () => {},
    language: 'fi',
    visible: true,
    onContinue: () => {},
    ...propOverrides,
  };

  return renderWithProviders(<UnconnectedHearingFormStep3 {...props} />);
};

describe('<HearingFormStep3 />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });
});
