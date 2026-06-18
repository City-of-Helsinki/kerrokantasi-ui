import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import HearingToolbar from '../HearingToolbar';
import renderWithProviders from '../../../utils/renderWithProviders';

// Returns a minimal hearing object. Defaults to an unpublished draft with open_at in the future.
const hearingFactory = (overrides = {}) => ({
  open_at: '2200-01-01T00:00:00Z',
  close_at: '2200-06-01T00:00:00Z',
  closed: false,
  published: false,
  ...overrides,
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    hearing: hearingFactory(),
    onCloseHearing: vi.fn(),
    onEdit: vi.fn(),
    onPublish: vi.fn(),
    onReportsClick: vi.fn(),
    onRevertPublishing: vi.fn(),
    onDeleteHearingDraft: vi.fn(),
  };
  return renderWithProviders(<HearingToolbar {...defaultProps} {...props} />);
};

describe('<HearingToolbar />', () => {
  it('renders reports and edit buttons in every status', () => {
    renderComponent();
    expect(screen.getByText('commentReportsButtonLabel')).toBeInTheDocument();
    expect(screen.getByText('editHearing')).toBeInTheDocument();
  });

  it('draft hearing — shows draft notification and publish + delete-draft buttons', () => {
    renderComponent({
      hearing: hearingFactory({ closed: false, published: false }),
    });

    expect(screen.getByText('draft')).toBeInTheDocument();
    expect(screen.getByText('publishHearing')).toBeInTheDocument();
    expect(screen.getByText('deleteDraft')).toBeInTheDocument();

    expect(screen.queryByText('published')).not.toBeInTheDocument();
    expect(screen.queryByText('closedHearing')).not.toBeInTheDocument();
    expect(screen.queryByText('closeHearing')).not.toBeInTheDocument();
  });

  it('draft with open_at in the past — publish button shows publishHearingNow', () => {
    renderComponent({
      hearing: hearingFactory({
        closed: false,
        published: false,
        open_at: '2000-01-01T00:00:00Z',
      }),
    });

    expect(screen.getByText('publishHearingNow')).toBeInTheDocument();
    expect(screen.queryByText('publishHearing')).not.toBeInTheDocument();
  });

  it('open and published hearing — shows published notification and close/revert buttons', () => {
    renderComponent({
      hearing: hearingFactory({ closed: false, published: true }),
    });

    expect(screen.getByText('published')).toBeInTheDocument();
    expect(screen.getByText('revertPublishing')).toBeInTheDocument();
    expect(screen.getByText('closeHearing')).toBeInTheDocument();

    expect(screen.queryByText('draft')).not.toBeInTheDocument();
    expect(screen.queryByText('publishHearing')).not.toBeInTheDocument();
    expect(screen.queryByText('deleteDraft')).not.toBeInTheDocument();
  });

  it('closed and published with past close_at — shows closedHearing notification, no action buttons', () => {
    renderComponent({
      hearing: hearingFactory({
        closed: true,
        published: true,
        close_at: '2000-01-01T00:00:00Z',
      }),
    });

    expect(screen.getByText('closedHearing')).toBeInTheDocument();

    expect(screen.queryByText('revertPublishing')).not.toBeInTheDocument();
    expect(screen.queryByText('closeHearing')).not.toBeInTheDocument();
    expect(screen.queryByText('publishHearing')).not.toBeInTheDocument();
  });

  it('closed and published with future close_at — shows toBePublishedHearing notification and revert button', () => {
    renderComponent({
      hearing: hearingFactory({
        closed: true,
        published: true,
        open_at: '2200-01-01T00:00:00Z',
        close_at: '2200-06-01T00:00:00Z',
      }),
    });

    // label is a fragment: "toBePublishedHearing <formatted date>" — use regex for partial match
    expect(screen.getByText(/toBePublishedHearing/)).toBeInTheDocument();
    expect(screen.getByText('revertPublishing')).toBeInTheDocument();

    expect(screen.queryByText('closeHearing')).not.toBeInTheDocument();
    expect(screen.queryByText('publishHearing')).not.toBeInTheDocument();
  });

  it('reports and edit buttons fire their handlers', () => {
    const onReportsClick = vi.fn();
    const onEdit = vi.fn();
    renderComponent({ onReportsClick, onEdit });

    fireEvent.click(screen.getByText('commentReportsButtonLabel'));
    expect(onReportsClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('editHearing'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('draft buttons fire their handlers', () => {
    const onPublish = vi.fn();
    const onDeleteHearingDraft = vi.fn();
    renderComponent({
      hearing: hearingFactory({ closed: false, published: false }),
      onPublish,
      onDeleteHearingDraft,
    });

    fireEvent.click(screen.getByText('publishHearing'));
    expect(onPublish).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('deleteDraft'));
    expect(onDeleteHearingDraft).toHaveBeenCalledTimes(1);
    // The onClick is wrapped: () => onDeleteHearingDraft() — no args passed
    expect(onDeleteHearingDraft).toHaveBeenCalledWith();
  });

  it('published-open buttons fire their handlers', () => {
    const onRevertPublishing = vi.fn();
    const onCloseHearing = vi.fn();
    renderComponent({
      hearing: hearingFactory({ closed: false, published: true }),
      onRevertPublishing,
      onCloseHearing,
    });

    fireEvent.click(screen.getByText('revertPublishing'));
    expect(onRevertPublishing).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('closeHearing'));
    expect(onCloseHearing).toHaveBeenCalledTimes(1);
  });
});
