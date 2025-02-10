import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import BaseCommentForm from '../BaseCommentForm';
import renderWithProviders from '../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('hds-react', () => {
  const actual = jest.requireActual('hds-react');

  return {
    ...actual,
    FileInput: jest.fn().mockImplementation(() => <div>FileInput</div>),
  };
});

const renderComponent = (propOverrides) => {
  const props = {
    loggedIn: true,
    user: { displayName: 'Test User', adminOrganizations: [] },
    collapseForm: false,
    defaultNickname: 'Test Nickname',
    answers: [],
    canComment: true,
    section: { questions: [] },
    isReply: false,
    nicknamePlaceholder: 'Enter your nickname',
    hearingGeojson: {},
    isHighContrast: false,
    language: 'en',
    closed: false,
    overrideCollapse: false,
    intl: getIntlAsProp(),
    onOverrideCollapse: jest.fn(),
    onPostComment: jest.fn(),
    onChangeAnswers: jest.fn(),
    ...propOverrides,
  };

  const store = mockStore({ accessibility: { isHighContrast: false } });

  return renderWithProviders(<BaseCommentForm {...props} />, { store });
};

describe('<BaseCommentForm />', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('toggles the form', () => {
    renderComponent();

    const toggleButton = screen.getByText('addComment');

    fireEvent.click(toggleButton);

    expect(screen.getByText('submit')).toBeInTheDocument();
  });

  it('submits a comment', async () => {
    const onPostComment = jest.fn();

    renderComponent({ onPostComment });

    const toggleButton = screen.getByText('addComment');

    fireEvent.click(toggleButton);

    const commentInput = await screen.findByTestId('write-comment');

    fireEvent.change(commentInput, { target: { value: 'Test comment' } });

    const submitButton = screen.getByText('submit');

    fireEvent.click(submitButton);

    expect(onPostComment).toHaveBeenCalledWith({
      authorName: 'Test Nickname',
      geojson: {},
      images: [],
      label: null,
      mapCommentText: '',
      organization: undefined,
      pinned: false,
      pluginData: undefined,
      text: 'Test comment',
    });
  });

  it('handles nickname change', () => {
    renderComponent();

    const toggleButton = screen.getByText('addComment');

    fireEvent.click(toggleButton);

    const nicknameInput = screen.getByPlaceholderText('Enter your nickname');

    fireEvent.change(nicknameInput, { target: { value: 'New Nickname' } });

    expect(nicknameInput.value).toBe('New Nickname');
  });
});
