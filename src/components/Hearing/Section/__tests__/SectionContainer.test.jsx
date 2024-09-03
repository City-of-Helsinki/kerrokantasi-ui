/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';

import SectionContainerComponent from '../SectionContainer';
import { mockStore as mockData } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';
import * as mockApi from '../../../../api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockedData = {
  results: [],
};
jest.spyOn(mockApi, 'get').mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockedData),
  }),
);

const renderComponent = (storeOverrides) => {
  const { mockHearingWithSections, mockUser, sectionComments } = mockData;

  const store = mockStore({
    hearing: {
      [mockHearingWithSections.data.slug]: {
        data: mockHearingWithSections.data,
      },
    },
    accessibility: {
      isHighContrast: false,
    },
    sectionComments,
    user: {
      data: mockUser,
    },
    ...storeOverrides,
  });

  const props = {
    hearing: {
      [mockHearingWithSections.data.slug]: {
        data: mockHearingWithSections.data,
      },
    },
    match: {
      params: {
        hearingSlug: mockHearingWithSections.data.slug,
      },
    },
    location: {
      pathname: `/${mockHearingWithSections.data.slug}`,
    },
    fetchCommentsForSortableList: jest.fn(),
  };

  return renderWithProviders(
    <BrowserRouter>
      <SectionContainerComponent {...props} />
    </BrowserRouter>,
    { store },
  );
};

describe('<SectionContainer />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render correctly when user is admin', () => {
    const mockUser = { ...mockData.mockUser, adminOrganizations: [mockData.mockHearingWithSections.data.organization] };

    renderComponent({ user: { data: mockUser } });
  });

  it('should toggle accordions', async () => {
    const mockUser = { ...mockData.mockUser, adminOrganizations: [mockData.mockHearingWithSections.data.organization] };

    renderComponent({ user: { data: mockUser } });

    const toggleButtons = await screen.findAllByRole('button');
    const filteredButtons = toggleButtons.filter((button) => button.hasAttribute('aria-expanded'));
    const currentExpanded = toggleButtons.map((button) => button.getAttribute('aria-expanded'));

    filteredButtons.forEach(async (button) => fireEvent.click(button));

    filteredButtons.forEach((button, index) =>
      expect(button.getAttribute('aria-expanded')).not.toEqual(currentExpanded[index]),
    );
  });
});
