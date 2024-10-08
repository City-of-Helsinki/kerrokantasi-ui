import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import HearingContainerComponent from '../HearingContainer';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = () => {
  const { mockHearingWithSections, labels, user } = mockData;

  const store = mockStore({
    hearing: mockHearingWithSections.data,
    hearingEditor: {
      languages: ['en', 'fi'],
      organizations: { all: [{ name: 'Kaupunkisuunnitteluvirasto', external_organization: false, frontId: '123' }] },
      hearing: mockHearingWithSections.data,
      labels: { all: ['1', '2'], byId: labels.data },
      editorState: {
        show: false,
        pending: 0,
        isSaving: false,
      },
    },
    user,
  });

  const props = {
    location: {
      pathname: mockHearingWithSections.data.slug,
      search: '',
    },
    match: {
      params: {
        hearingSlug: mockHearingWithSections.data.slug,
      },
    },
  };

  return renderWithProviders(<HearingContainerComponent {...props} />, { store });
};

describe('<HearingContainer />', () => {
  test('renders correctly', () => {
    renderComponent();
  });
});
