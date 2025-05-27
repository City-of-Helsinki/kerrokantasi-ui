import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import CommentReportForm from '../CommentReportForm';
import { mockStore as mockData } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (propsOverrides) => {
  const props = {
    id: 'test',
    hearing: mockData.mockHearingWithSections,
    ...propsOverrides,
  };

  const store = mockStore({ language: 'fi' });

  return renderWithProviders(
    <BrowserRouter>
      <CommentReportForm {...props} />
    </BrowserRouter>,
    { store },
  );
};

describe('<CommentReportForm />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render label', async () => {
    renderComponent();

    expect(await screen.findByText('commentReportsSelectFileType')).toBeInTheDocument();
  });

  it('should export report', async () => {
    renderComponent();

    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ blob: () => Promise.resolve({}) }));

    const buttons = await screen.findAllByRole('button');
    const toggle = buttons[0];
    const submit = buttons[1];

    await user.click(toggle);

    const option = screen.queryByText('PowerPoint');

    await user.click(option);
    
    window.URL.createObjectURL = vi.fn(() => 'https://test.com');
    
    await user.click(submit);

    await waitFor(() => expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1));
  });

  it('should handle error', async () => {
    renderComponent();

    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('ERROR!')));

    window.URL.createObjectURL = vi.fn(() => 'https://test.com');

    const buttons = await screen.findAllByRole('button');
    const toggle = buttons[0];
    const submit = buttons[1];

    await user.click(toggle);

    const option = screen.queryByText('PowerPoint');

    await user.click(option);
    await user.click(submit);

    await waitFor(() => expect(window.URL.createObjectURL).not.toHaveBeenCalled());
  });
});
