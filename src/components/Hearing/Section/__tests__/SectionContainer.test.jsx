import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {UnconnectedSectionContainerComponent} from '../SectionContainer';
import { mockStore } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';
import createAppStore from '../../../../createStore';
import * as mockApi from '../../../../api';

const { labels, sectionComments, mockHearingWithSections, user } = mockStore;

const mockedData = {
    results: []
  };
jest.spyOn(mockApi, 'get').mockImplementation(() => ( 
  Promise.resolve(
    {
      json: () => Promise.resolve(mockedData),
    }
  )));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: `/${mockHearingWithSections.data.id}`,
    search: '',
  }),
  useParams: () => ({
    hearingSlug: mockHearingWithSections.data.id,
  }),
}));

const renderComponent = (propOverrides) => {
  const props = {
    labels: labels.data,
    hearing: mockHearingWithSections.data,
    hearingDraft: {},
    sectionComments,
    showClosureInfo: true,
    sections: mockHearingWithSections.data.sections,
    language: 'fi',
    contacts: mockHearingWithSections.data.contacts,
    user,
    fetchCommentsForSortableList: jest.fn(),
    ...propOverrides,
  };

  const history = createMemoryHistory();
  const storeMock = createAppStore({
    hearing: {
      [mockHearingWithSections.data.id]: {
        ...mockHearingWithSections,
      },
    },
  });

  return renderWithProviders(
    <MemoryRouter>
      <UnconnectedSectionContainerComponent {...props} />
    </MemoryRouter>,
    { store: storeMock, history },
  );
};

describe('<SectionContainer />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
