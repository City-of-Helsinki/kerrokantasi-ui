import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import HearingContainerComponent from '../HearingContainer';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const mockStore = configureStore([thunk]);

describe('<HearingContainer />', () => {
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

  it('should render the component', () => {
    renderWithProviders(
      <Provider store={store}>
        <MemoryRouter>
          <HearingContainerComponent />
        </MemoryRouter>
      </Provider>,
      { store },
    );
  });
});
