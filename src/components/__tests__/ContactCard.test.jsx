import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import ContactCard from '../ContactCard';
import { mockStore } from '../../../test-utils';
import renderWithProviders from '../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const { mockHearingWithSections } = mockStore;
  const props = { ...mockHearingWithSections.data.contact_persons[0], ...propOverrides };

  return renderWithProviders(
    <MemoryRouter>
      <ContactCard {...props} />
    </MemoryRouter>,
  );
};

describe('<ContactCard />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
