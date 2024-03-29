import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from '../../../utils/renderWithProviders';
import NewHearingContainer from '../NewHearingContainer';

const mockProps = {
  fetchEditorMetaData: jest.fn(),
  initHearing: jest.fn(),
  fetchProjectsList: jest.fn(),
};

describe('<NewHearingContainer />', () => {
  it('should render correctly', () => {
    renderWithProviders(
      <MemoryRouter>
        <NewHearingContainer props={mockProps} />
      </MemoryRouter>,
    );
  });
});
