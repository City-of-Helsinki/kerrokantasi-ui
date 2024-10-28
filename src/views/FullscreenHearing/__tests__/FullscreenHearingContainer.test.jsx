import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { thunk }  from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import FullscreenHearingContainerComponent from '../FullscreenHearingContainer';
import { mockStore as testData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  hearing: {},
  language: 'en',
  user: {},
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
            hearingSlug: 'mockHearing'
        }),
}));

describe('FullscreenHearingContainerComponent', () => {
  it('renders LoadSpinner when hearing is empty', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FullscreenHearingContainerComponent />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('load-spinner')).toBeInTheDocument();
  });

  it('renders hearing content when hearing is not empty', async () => {
    const populatedStore = mockStore({
      hearing: testData.hearing,
      language: 'en',
      user: {},
      sectionComments: [], 
    });

    render(
    <IntlProvider>
      <Provider store={populatedStore}>
        <BrowserRouter>
          <FullscreenHearingContainerComponent />
        </BrowserRouter>
      </Provider>
      </IntlProvider>
    );
    await waitFor(() => {
        expect(screen.getByText(testData.hearing.mockHearing.data.title.fi)).toBeInTheDocument();
    }, {timeout: 2000})
  });
});