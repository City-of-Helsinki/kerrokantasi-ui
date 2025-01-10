import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { UnconnectedHearingFormStep1 } from '../HearingFormStep1';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    hearing: {labels: [], contact_persons: []},
    labels: [],
    contactPersons: [],
    hearingLanguages: [],
    organizations: [],
    errors: {title: ''},
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <UnconnectedHearingFormStep1 {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingFormStep1 />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
