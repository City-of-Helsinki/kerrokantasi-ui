import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import messages from '../../i18n';
import { HIDE_ALERT_DIALOG } from '../../actions/alertDialog';
import AlertDialog from '../AlertDialog';

const mockStore = configureMockStore([]);

const renderComponent = (alertDialog) => {
  const store = mockStore({ alertDialog });

  render(
    <Provider store={store}>
      <IntlProvider locale='en' messages={messages.en}>
        <AlertDialog />
      </IntlProvider>
    </Provider>
  );

  return store;
};

describe('<AlertDialog />', () => {
  it('renders nothing while closed', () => {
    renderComponent(null);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the localized message in a labelled dialog', () => {
    renderComponent({ messageId: 'commentReceived' });

    const dialog = screen.getByRole('dialog', { name: 'Kerrokantasi' });
    expect(dialog).toHaveAccessibleDescription(messages.en.commentReceived);
  });

  it('closes from its close button', async () => {
    const store = renderComponent({ messageId: 'commentReceived' });

    // The header's close icon button shares the label, so take the
    // action button at the bottom of the dialog.
    const closeButtons = screen.getAllByRole('button', {
      name: messages.en.close,
    });
    await userEvent.click(closeButtons[closeButtons.length - 1]);

    expect(store.getActions()).toEqual([{ type: HIDE_ALERT_DIALOG }]);
  });
});
