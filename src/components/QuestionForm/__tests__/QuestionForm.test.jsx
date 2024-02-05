/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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
    onChange: () => {},
    answers: {
      answers: [],
      question: 10,
      type: TYPE_SINGLE_CHOICE,
    },
    canAnswer: true,
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <QuestionForm intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<QuestionForm />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render FormGroup', async () => {
    renderComponent();

    expect(await screen.findByTestId('question-form-group')).toBeInTheDocument();
  });

  it('should render label', async () => {
    renderComponent();

    expect(await screen.findByText('fi test one')).toBeInTheDocument();
  });

  it('should render HelpBlock', async () => {
    renderComponent();

    expect(await screen.findByText('questionHelpSingle')).toBeInTheDocument();
  });

  it('should render HelpBlock when question type is multi', async () => {
    renderComponent({
      question: {
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
      },
    });

    expect(await screen.findByText('questionHelpMulti')).toBeInTheDocument();
  });

  it('should require login to answer', async () => {
    renderComponent({ canAnswer: false });

    expect(await screen.findByText('logInToAnswer')).toBeInTheDocument();
  });

  it('should call onChange when a single-choice option is selected', async () => {
    const onChangeMock = jest.fn();

    renderComponent({ onChange: onChangeMock });

    const optionOne = await screen.findByLabelText('fi test one');

    const user = userEvent.setup();

    user.click(optionOne);

    await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(10, TYPE_SINGLE_CHOICE, 20));
  });

  it('should call onChange when a multiple-choice option is selected', async () => {
    const onChangeMock = jest.fn();

    renderComponent({
      question: {
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
      },
      onChange: onChangeMock,
    });

    const optionOne = await screen.findByLabelText('fi test one');

    const user = userEvent.setup();

    user.click(optionOne);

    await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(10, TYPE_MULTIPLE_CHOICE, 20));
  });
});
