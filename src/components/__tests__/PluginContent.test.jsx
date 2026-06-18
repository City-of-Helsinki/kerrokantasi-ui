import { screen } from '@testing-library/react';

import PluginContent from '../PluginContent';
import renderWithProviders from '../../utils/renderWithProviders';

vi.mock('../plugins/MapQuestionnaire', () => ({
  default: ({ pluginInstanceId, pluginPurpose }) => (
    <div
      data-testid='map-quest'
      data-instance-id={pluginInstanceId}
      data-purpose={pluginPurpose || ''}
    />
  ),
}));

const sectionFactory = (overrides = {}) => ({
  id: 'sec-1',
  plugin_identifier: 'map-bikeracks',
  plugin_data: '',
  n_comments: 0,
  ...overrides,
});

const commentsFactory = (overrides = {}) => ({
  isFetching: false,
  results: [],
  ordering: '-created_at',
  ...overrides,
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    hearingSlug: 'test-slug',
    section: sectionFactory(),
    comments: commentsFactory(),
    fetchAllComments: vi.fn(),
    onPostComment: vi.fn(),
    onPostVote: vi.fn(),
  };
  return renderWithProviders(<PluginContent {...defaultProps} {...props} />);
};

describe('<PluginContent />', () => {
  it('returns null when plugin_identifier is falsy', () => {
    // Note: mount effect still fires fetchAllComments for non-mapdon plugins,
    // even when render returns null. This test only asserts the render output.
    renderComponent({ section: sectionFactory({ plugin_identifier: '' }) });
    expect(screen.queryByTestId('map-quest')).not.toBeInTheDocument();
  });

  it('mount effect fires fetchAllComments for default plugin when not fetching', () => {
    const fetchAllComments = vi.fn();
    renderComponent({
      section: sectionFactory({ plugin_identifier: 'map-bikeracks' }),
      comments: commentsFactory({ isFetching: false }),
      fetchAllComments,
    });

    expect(fetchAllComments).toHaveBeenCalledTimes(1);
    expect(fetchAllComments).toHaveBeenCalledWith('test-slug', 'sec-1');
    expect(screen.getByTestId('map-quest').dataset.instanceId).toBe('map');
  });

  it('mount effect skips fetchAllComments for mapdon-hkr and renders hkr variant', () => {
    const fetchAllComments = vi.fn();
    renderComponent({
      section: sectionFactory({ plugin_identifier: 'mapdon-hkr' }),
      fetchAllComments,
    });

    expect(fetchAllComments).not.toHaveBeenCalled();
    expect(screen.getByTestId('map-quest').dataset.instanceId).toBe('hkr');
    expect(screen.getByTestId('map-quest').dataset.purpose).toBe('');
  });

  it('mount effect skips fetchAllComments for mapdon-ksv and renders ksv variant', () => {
    const fetchAllComments = vi.fn();
    renderComponent({
      section: sectionFactory({ plugin_identifier: 'mapdon-ksv' }),
      fetchAllComments,
    });

    expect(fetchAllComments).not.toHaveBeenCalled();
    expect(screen.getByTestId('map-quest').dataset.instanceId).toBe('ksv');
    expect(screen.getByTestId('map-quest').dataset.purpose).toBe(
      'postComments'
    );
  });

  it('mount effect skips fetchAllComments when comments.isFetching is true', () => {
    const fetchAllComments = vi.fn();
    renderComponent({
      comments: commentsFactory({ isFetching: true }),
      fetchAllComments,
    });

    expect(fetchAllComments).not.toHaveBeenCalled();
    // Component still renders
    expect(screen.getByTestId('map-quest')).toBeInTheDocument();
  });

  it('watch effect first-render guard prevents double-fetch on mount', () => {
    // Regression test for migration 1.1.2 (isMounted ref guard):
    // Even when initial comments already have empty results and n_comments > 0,
    // the watch effect must NOT fire fetchAllComments on the first render —
    // only the mount effect should.
    const fetchAllComments = vi.fn();
    renderComponent({
      section: sectionFactory({ n_comments: 5 }),
      comments: commentsFactory({ results: [], isFetching: false }),
      fetchAllComments,
    });

    expect(fetchAllComments).toHaveBeenCalledTimes(1); // mount effect only
    expect(fetchAllComments).toHaveBeenCalledWith('test-slug', 'sec-1');
  });

  it('watch effect re-fetches when comments update to empty results after a post', () => {
    const fetchAllComments = vi.fn();
    const section = sectionFactory({ n_comments: 3 });
    const sharedProps = {
      hearingSlug: 'test-slug',
      section,
      fetchAllComments,
      onPostComment: vi.fn(),
      onPostVote: vi.fn(),
    };

    const { rerender } = renderWithProviders(
      <PluginContent
        {...sharedProps}
        comments={commentsFactory({ results: [{ id: 1 }] })}
      />
    );
    expect(fetchAllComments).toHaveBeenCalledTimes(1); // mount effect

    // Simulate post response: server clears results while n_comments is still > 0
    rerender(
      <PluginContent
        {...sharedProps}
        comments={commentsFactory({ results: [], ordering: '-created_at' })}
      />
    );

    expect(fetchAllComments).toHaveBeenCalledTimes(2);
    expect(fetchAllComments).toHaveBeenLastCalledWith(
      'test-slug',
      'sec-1',
      '-created_at'
    );
  });
});
