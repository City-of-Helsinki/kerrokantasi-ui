import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

import { SectionContainerComponent } from '../SectionContainer';
import { mockStore as mockData } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (propOverrides) => {
  const {
    hearingLists: { allHearings },
    mockHearingWithSections,
    user,
  } = mockData;

  const store = mockStore({
    hearing: mockHearingWithSections.data,
    accessibility: {
      isHighContrast: false,
    },
    user,
  });

  const props = {
    hearing: mockHearingWithSections.data,
    match: {
      params: {
        hearingSlug: allHearings.data[0].slug,
      },
    },
    location: {
      pathname: `/${allHearings.data[0].slug}`,
    },
    sections: mockHearingWithSections.data.sections,
    fetchCommentsForSortableList: jest.fn(),
    ...propOverrides,
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
