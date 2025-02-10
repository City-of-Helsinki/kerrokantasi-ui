import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MapQuestionnaire from '../MapQuestionnaire';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const { sectionComments, mockHearingWithSections, mockUser } = mockData;

const renderComponent = (propOverrides) => {
  const props = {
    comments: sectionComments.mock.results,
    data: {
      answers: sectionComments.mock.results[0].answers,
      defaultNickname: 'Test Nickname',
      comments: sectionComments.mock.results,
      isReply: false,
      loggedIn: true,
      nicknamePlaceholder: 'Enter your nickname',
      section: mockHearingWithSections.data.sections[0],
      user: mockUser,
    },
    onPostComment: jest.fn(),
    onPostVote: jest.fn(),
    pluginInstanceId: 'hkr',
    pluginPurpose: 'postComments',
    pluginSource: 'mock-plugin-source',
    ...propOverrides,
  };

  const store = mockStore({});

  return renderWithProviders(<MapQuestionnaire {...props} />, { store });
};

describe('<MapQuestionnaire />', () => {
  it('renders hkr correctly', () => {
    renderComponent();
  });

  it('renders ksv correctly', () => {
    renderComponent({ pluginInstanceId: 'ksv' });
  });

  it('renders default correctly', () => {
    renderComponent({ pluginInstanceId: undefined });
  });

  it('handles text input change', async () => {
    const user = userEvent.setup();

    renderComponent();

    const textArea = screen.getByPlaceholderText('Kommentoi ehdotustasi tässä.');

    await user.type(textArea, 'Test comment');

    expect(textArea.value).toBe('Test comment');
  });
});
