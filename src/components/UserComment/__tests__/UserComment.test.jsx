import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getIntlAsProp } from '../../../../test-utils';
import UserComment from '../UserComment';
import renderWithProviders from '../../../utils/renderWithProviders';

const defaultCommentData = {
  author: 'DefaultUser',
  created_at: new Date('10 September 2021 12:30').toISOString(),
  closed: false,
  deleted: false,
  deletedAt: null,
  deletedByType: null,
  slug: 'hearingSlug',
  content: 'is this working?',
  geojson: null,
};

const mockComment = (props = {}) => ({
  author_name: props.author || defaultCommentData.author,
  created_at: defaultCommentData.created_at,
  deleted: props.deleted || defaultCommentData.deleted,
  deleted_at: props.deletedAt || defaultCommentData.deletedAt,
  deleted_by_type: props.deletedByType || defaultCommentData.deletedByType,
  hearing_data: {
    closed: props.closed || defaultCommentData.closed,
    slug: props.slug || defaultCommentData.slug,
  },
  content: props.content || defaultCommentData.content,
  geojson: props.geojson || defaultCommentData.geojson,
});
const defaultProps = {
  comment: mockComment(),
};

const deletedAt = '2022-01-31T09:45:00.284857Z';

const ARIA_EXPANDED = 'aria-expanded';

const renderComponent = (propOverrides) => {
  const props = {
    comment: mockComment(),
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <UserComment intl={getIntlAsProp()} {...defaultProps} {...props} />
    </MemoryRouter>,
  );
};

describe('<UserComment />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render user', async () => {
    renderComponent();

    expect(await screen.findByText('DefaultUser')).toBeInTheDocument();
  });

  it('should render hearing comment status', async () => {
    renderComponent();

    expect(await screen.findByText('openHearing')).toBeInTheDocument();
  });

  it('should render comment body', async () => {
    renderComponent();

    expect(await screen.findByText(defaultCommentData.content)).toBeInTheDocument();
  });

  it('should render message when comment deleted by self', async () => {
    const deleted = true;

    const deletedByTypes = { moderator: 'moderator', self: 'self' };

    const comment = mockComment({ deleted, deletedAt, deletedByType: deletedByTypes.self });

    renderComponent({ comment });

    expect(await screen.findByText('sectionCommentSelfDeletedMessage')).toBeInTheDocument();
  });

  it('should render message when comment deleted by moderator', async () => {
    const deleted = true;
    const deletedByTypes = { moderator: 'moderator', self: 'self' };

    const comment = mockComment({ deleted, deletedAt, deletedByType: deletedByTypes.moderator });

    renderComponent({ comment });

    expect(await screen.findByText('sectionCommentDeletedMessage')).toBeInTheDocument();
  });

  it('should render message when comment deleted by unknown', async () => {
    const deleted = true;

    const comment = mockComment({ deleted, deletedAt });

    renderComponent({ comment });

    expect(await screen.findByText('sectionCommentGenericDeletedMessage')).toBeInTheDocument();
  });

  it('map toggle button is rendered if comment has geojson', async () => {
    const geojsonValues = { geojson: { type: 'Point', coordinates: [22.254456, 60.459252] } };

    renderComponent({ comment: mockComment(geojsonValues) });

    const toggleButton = await screen.findByRole('button', { name: 'commentShowMap' });

    const user = userEvent.setup();

    user.click(toggleButton);

    await waitFor(() => expect(toggleButton.getAttribute(ARIA_EXPANDED)).toBe('true'));

    user.click(toggleButton);

    await waitFor(() => expect(toggleButton.getAttribute(ARIA_EXPANDED)).toBe('false'));
  });
});
