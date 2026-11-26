import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PleaseLogin from '../PleaseLogin';
import renderWithProviders from '../../../utils/renderWithProviders';

describe('<PleaseLogin />', () => {
  it('shows the login prompt inside the page container', async () => {
    const login = vi.fn();
    renderWithProviders(<PleaseLogin login={login} />);

    const heading = screen.getByRole('heading', { name: 'loginToContinue' });
    expect(heading.parentElement).toHaveClass('container');

    await userEvent.click(screen.getByRole('button', { name: 'login' }));
    expect(login).toHaveBeenCalled();
  });
});
