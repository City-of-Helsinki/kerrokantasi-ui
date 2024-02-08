import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import CommentReportModal from '../CommentReportModal';
import { mockStore } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propsOverrides) => {
  const props = {
    hearing: mockStore.mockHearingWithSections,
    isOpen: false,
    onClose: () => {},
    ...propsOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <CommentReportModal {...props} />
    </MemoryRouter>,
  );
};

describe('<CommentReportModal />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render content', async () => {
    renderComponent({ isOpen: true });

    expect(await screen.findByRole('heading', { name: 'commentReportsTitle' })).toBeInTheDocument();
    expect(await screen.findByText('commentReportsSelectFileType')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'commentReportsClose' })).toBeInTheDocument();
  });
});
