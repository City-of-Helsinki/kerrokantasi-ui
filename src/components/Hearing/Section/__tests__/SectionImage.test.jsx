import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import SectionImage from '../SectionImage';
import { mockStore } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const { mockHearingWithSections } = mockStore;
  const props = {
    image: mockHearingWithSections.data.sections[0].images[0],
    caption: 'Mock Von Caption',
    title: 'Amazing Title',
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <SectionImage {...props} />
    </MemoryRouter>,
  );
};

describe('<SectionImage />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
