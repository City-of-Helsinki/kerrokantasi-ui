/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getIntlAsProp } from '../../../../test-utils';
import QuestionForm from '..';
import renderWithProviders from '../../../utils/renderWithProviders';

const TYPE_SINGLE_CHOICE = 'single-choice';
const TYPE_MULTIPLE_CHOICE = 'multiple-choice';

const renderComponent = (propOverrides) => {
  const props = {
    autoFocus: false,
    question: {
      id: 10,
      is_independent_poll: false,
      n_answers: 0,
      options: [
        { id: 20, n_answers: 0, text: { fi: 'fi test one' } },
        { id: 21, n_answers: 0, text: { fi: 'fi test two' } },
        { id: 22, n_answers: 0, text: { fi: 'fi test three' } },
      ],
      text: { fi: 'fi single choice question' },
      type: TYPE_SINGLE_CHOICE,
    },
    lang: 'fi',
    onChange: jest.fn(),
    answers: {
      answers: [],
      question: 10,
      type: TYPE_SINGLE_CHOICE,
    },
    canAnswer: true,
    ...propOverrides,
  };

  return renderWithProviders(
    <BrowserRouter>
      <QuestionForm intl={getIntlAsProp()} {...props} />
    </BrowserRouter>,
  );
};

describe('<QuestionForm />', () => {
  it('should render correctly', () => {
    renderComponent();
    expect(screen.getByTestId('question-form-group')).toBeInTheDocument();
  });

  it('should render single choice options correctly', () => {
    renderComponent();
    expect(screen.getByLabelText('fi test one')).toBeInTheDocument();
    expect(screen.getByLabelText('fi test two')).toBeInTheDocument();
    expect(screen.getByLabelText('fi test three')).toBeInTheDocument();
  });

  it('should call onChange when a single choice option is selected', async () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    userEvent.click(screen.getByLabelText('fi test one'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(10, TYPE_SINGLE_CHOICE, 20);
    });
  });

  it('should render multiple choice options correctly', () => {
    const question = {
      id: 10,
      is_independent_poll: false,
      n_answers: 0,
      options: [
        { id: 20, n_answers: 0, text: { fi: 'fi test one' } },
        { id: 21, n_answers: 0, text: { fi: 'fi test two' } },
        { id: 22, n_answers: 0, text: { fi: 'fi test three' } },
      ],
      text: { fi: 'fi multiple choice question' },
      type: TYPE_MULTIPLE_CHOICE,
    };

    renderComponent({ question });

    expect(screen.getByLabelText('fi test one')).toBeInTheDocument();
    expect(screen.getByLabelText('fi test two')).toBeInTheDocument();
    expect(screen.getByLabelText('fi test three')).toBeInTheDocument();
  });

  it('should call onChange when a multiple choice option is selected', async () => {
    const onChange = jest.fn();
    const question = {
      id: 10,
      is_independent_poll: false,
      n_answers: 0,
      options: [
        { id: 20, n_answers: 0, text: { fi: 'fi test one' } },
        { id: 21, n_answers: 0, text: { fi: 'fi test two' } },
        { id: 22, n_answers: 0, text: { fi: 'fi test three' } },
      ],
      text: { fi: 'fi multiple choice question' },
      type: TYPE_MULTIPLE_CHOICE,
    };

    renderComponent({ question, onChange });

    userEvent.click(screen.getByLabelText('fi test one'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(10, TYPE_MULTIPLE_CHOICE, 20);
    });
  });

  it('should display login message when user cannot answer', () => {
    renderComponent({ canAnswer: false });
    expect(screen.getByText('logInToAnswer')).toBeInTheDocument();
  });
});
