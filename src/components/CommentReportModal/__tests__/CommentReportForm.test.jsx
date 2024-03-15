import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UnconnectedCommentReportForm as CommentReportForm } from '../CommentReportForm';
import { mockStore } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propsOverrides) => {
  const props = {
    id: 'test',
    apiToken: { apiInitialized: true, apiToken: '123-abc', isFetching: false, loadingToken: false },
    hearing: mockStore.mockHearingWithSections,
    language: 'fi',
    ...propsOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <CommentReportForm {...props} />
    </MemoryRouter>,
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

  it('calls setState with correct params', async () => {
    renderComponent();

    const user = userEvent.setup();

    const controls = await screen.findByRole('combobox');
    const option = await screen.findByRole('option', { name: 'PowerPoint' });

    await user.selectOptions(controls, option);

    expect(option.selected).toBe(true);
  });
});
