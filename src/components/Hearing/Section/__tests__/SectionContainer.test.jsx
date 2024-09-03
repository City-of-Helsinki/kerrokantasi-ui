import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

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

const renderComponent = () => {
  const { mockHearingWithSections, user, sectionComments } = mockData;

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
    user,
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
});
