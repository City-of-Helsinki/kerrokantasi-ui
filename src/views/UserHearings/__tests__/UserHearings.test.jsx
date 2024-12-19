import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { UnconnectedUserHearings } from '..';
import { getIntlAsProp, mockStore, mockUser } from '../../../../test-utils';
import { getUserHearingList } from '../../../selectors/hearing';
import renderWithProviders from '../../../utils/renderWithProviders';

const mockState = mockStore;
const mockLoggedUser = mockUser;
mockLoggedUser.adminOrganizations = ['usersOrganization'];
const defaultProps = {
  user: mockLoggedUser,
  userState: { userExists: true, userLoading: false },
  fetching: getUserHearingList(mockState, 'isFetching'),
  fetchHearingList: vi.fn(),
  hearingCount: getUserHearingList(mockState, 'count'),
  hearingData: getUserHearingList(mockState, 'data'),
};

const TEST_ID_HEARING_CARDS = 'hearing-cards';

const renderComponent = (props) =>
  renderWithProviders(
    <MemoryRouter>
      <UnconnectedUserHearings intl={getIntlAsProp()} {...defaultProps} {...props} />
    </MemoryRouter>,
  );

describe('<UserHearings />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call fetchAllHearings if userExists && user is true', () => {
    const fetchHearingListMock = vi.fn();

    renderComponent({ fetchHearingList: fetchHearingListMock });

    expect(fetchHearingListMock).toHaveBeenCalled();
  });

  it('should not call fetchAllHearings if userExists && user is false', () => {
    const fetchHearingListMock = vi.fn();

    renderComponent({ fetchHearingList: fetchHearingListMock, userState: { userExists: false, userLoading: false } });

    expect(fetchHearingListMock).not.toHaveBeenCalled();
  });

  it('should call fetchAllHearings if !prevProps.user && this.props.user', () => {
    const fetchHearingListMock = vi.fn();

    renderComponent({
      fetchHearingList: fetchHearingListMock,
      user: defaultProps.user,
      userState: { userExists: true, userLoading: false },
    });

    expect(fetchHearingListMock).toHaveBeenCalled();
  });

  it('should render LoadSpinner when fetching is true', async () => {
    renderComponent({
      fetching: {
        open: true,
        queue: true,
        closed: true,
        draft: true,
      },
    });

    expect(await screen.findAllByTestId('load-spinner')).toHaveLength(4);
  });

  it('should render "noHearings" message when hearingData is empty', async () => {
    renderComponent({
      hearingData: {
        open: [],
        queue: [],
        closed: [],
        draft: [],
      },
    });

    expect(await screen.findAllByText('noHearings')).toHaveLength(4);
  });

  it('should render HearingCards and Button when hearingData has more than 4 items', async () => {
    renderComponent({
      hearingCount: {
        open: 5,
        queue: 0,
        closed: 0,
        draft: 0,
      },
      hearingData: {
        open: [{ slug: '1' }, { slug: '2' }, { slug: '3' }, { slug: '4' }],
        queue: [],
        closed: [],
        draft: [],
      },
    });

    const hearingCards = await screen.findByTestId(TEST_ID_HEARING_CARDS);

    expect(hearingCards.children).toHaveLength(4);
    expect(await screen.findByText('showAll')).toBeInTheDocument();
  });

  it('should render HearingCards without Button when hearingData has less than or equal to 4 items', async () => {
    renderComponent({
      hearingCount: {
        open: 4,
        queue: 0,
        closed: 0,
        draft: 0,
      },
      hearingData: {
        open: [{ slug: '1' }, { slug: '2' }, { slug: '3' }, { slug: '4' }],
        queue: [],
        closed: [],
        draft: [],
      },
    });

    const hearingCards = await screen.findByTestId(TEST_ID_HEARING_CARDS);

    expect(hearingCards.children).toHaveLength(4);

    expect(screen.queryByText('showAll')).not.toBeInTheDocument();
  });

  it('should render HearingCard components based on hearingData', async () => {
    renderComponent({
      hearingData: {
        open: [{ slug: '1' }, { slug: '2' }],
        queue: [{ slug: '3' }],
        closed: [],
        draft: [{ slug: '4' }, { slug: '5' }],
      },
    });

    const hearingCards = await screen.findAllByTestId(TEST_ID_HEARING_CARDS);

    expect(hearingCards).toHaveLength(3);
  });

  it('should render h2 element with correct content', async () => {
    renderComponent({
      hearingCount: {
        open: 10,
        queue: 5,
        closed: 3,
        draft: 0,
      },
    });

    expect(await screen.findByText('openCount')).toBeInTheDocument();
    expect(await screen.findByText('queueCount')).toBeInTheDocument();
    expect(await screen.findByText('closedCount')).toBeInTheDocument();
    expect(await screen.findByText('draftCount')).toBeInTheDocument();
  });

  it('should call fetchAllHearings with correct parameters', () => {
    const fetchHearingListMock = vi.fn();

    renderComponent({ fetchHearingList: fetchHearingListMock });

    expect(fetchHearingListMock).toHaveBeenCalled();

    expect(fetchHearingListMock).toHaveBeenCalledTimes(4);
  });
});
