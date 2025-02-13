import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';

import Phase from '../Phase';
import renderWithProviders from '../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const storeInitialState = {};

const renderComponent = (propOverrides, storeOverride) => {
  const props = {
    phaseInfo: {
      id: '1',
      frontId: '1',
      title: { en: 'Phase 1', fi: 'Vaihe 1' },
      schedule: { en: 'Schedule 1', fi: 'Aikataulu 1' },
      description: { en: 'Description 1', fi: 'Kuvaus 1' },
      is_active: false,
      has_hearings: false,
    },
    indexNumber: 0,
    onDelete: jest.fn(),
    onChange: jest.fn(),
    onActive: jest.fn(),
    languages: ['en', 'fi'],
    errors: {},
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<Phase {...props} />, { store });
};

describe('<Phase />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should call onChange when title is changed', () => {
    const onChange = jest.fn();

    renderComponent({ onChange });

    fireEvent.change(screen.getAllByLabelText(/phase 1 /i)[0], { target: { value: 'New Title' } });

    expect(onChange).toHaveBeenCalledWith('1', 'title', 'en', 'New Title');
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();

    renderComponent({ onDelete });

    fireEvent.click(screen.getByTestId('remove-phase'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should call onActive when checkbox is changed', () => {
    const onActive = jest.fn();

    renderComponent({ onActive });

    fireEvent.click(screen.getByLabelText('phaseActive'));

    expect(onActive).toHaveBeenCalledWith('1');
  });

  it('should display error message when title is invalid', () => {
    const errors = { project_phase_title: 'Title is required' };
    renderComponent({ errors });

    expect(screen.getAllByText('Title is required')[0]).toBeInTheDocument();
  });
});
