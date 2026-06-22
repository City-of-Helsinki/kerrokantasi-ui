import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import { thunk, mockStore as testData } from '../../../../test-utils';
import FullscreenHearingContainerComponent from '../FullscreenHearingContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  hearing: {},
  language: 'en',
  user: {},
});

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');

  return {
    ...mod,
    useParams: () => ({
      hearingSlug: 'mockHearing',
    }),
  };
});

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
      <IntlProvider
        locale='fi'
        messages={{}}
        onError={(err) => {
          if (err.code === 'MISSING_TRANSLATION') return;
          // eslint-disable-next-line no-console
          console.error(err);
        }}
      >
        <Provider store={populatedStore}>
          <BrowserRouter>
            <FullscreenHearingContainerComponent />
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    );
    await waitFor(
      () => {
        expect(
          screen.getByText(testData.hearing.mockHearing.data.title.fi)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
