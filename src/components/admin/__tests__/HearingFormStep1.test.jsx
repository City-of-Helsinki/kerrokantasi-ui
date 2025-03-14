import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import HearingFormStep1 from '../HearingFormStep1';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (propOverrides) => {
  const { labels, mockHearingWithSections } = mockData;

  const props = {
    hearing: { title: { fi: '' }, labels: [], contact_persons: [] },
    labels: labels.data,
    contactPersons: mockHearingWithSections.data.contact_persons,
    hearingLanguages: ['fi'],
    onLanguagesChange: vi.fn(),
    onHearingChange: vi.fn(),
    onContinue: vi.fn(),
    errors: {},
    organizations: [],
    ...propOverrides,
  };

  const store = mockStore({ language: 'fi' });

  return renderWithProviders(<HearingFormStep1 {...props} />, { store });
};

describe('<HearingFormStep1 />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should open label modal when add label button is clicked', async () => {
    renderComponent();

    fireEvent.click(await screen.findByTestId('add-new-label'));

    expect(screen.getByText('createLabel')).toBeInTheDocument();
  });

  it('should open contact modal when add contact button is clicked', async () => {
    renderComponent();

    fireEvent.click(await screen.findByTestId('add-new-contact'));

    expect(screen.getByText('createContact')).toBeInTheDocument();
  });

  it('should call onHearingChange when title is changed', async () => {
    const onHearingChange = vi.fn();

    renderComponent({ onHearingChange });

    const inputs = await screen.findAllByRole('textbox');
    const input = inputs[0];

    fireEvent.blur(input, { target: { value: 'New Title' } });

    await waitFor(() => expect(onHearingChange).toHaveBeenCalledWith('title', { fi: 'New Title' }));
  });

  it('should call onLabelsChange when labels are changed', async () => {
    const onHearingChange = vi.fn();

    renderComponent({ onHearingChange });

    const selects = await screen.findAllByRole('combobox');
    const select = selects[0];

    fireEvent.change(select, { target: { value: 'Mock Von Label' } });

    const option = await screen.findByText('Mock Von Label');

    fireEvent.click(option);

    expect(onHearingChange).toHaveBeenCalled();
  });

  it('should call onContactsChange when contacts are changed', async () => {
    const onHearingChange = vi.fn();

    renderComponent({ onHearingChange });

    const selects = await screen.findAllByRole('combobox');
    const select = selects[1];

    fireEvent.change(select, { target: { value: 'Seija' } });

    const option = await screen.findByText('Seija Suunnittelija');

    fireEvent.click(option);

    expect(onHearingChange).toHaveBeenCalled();
  });

  it('should call onContinue when continue button is clicked', () => {
    const onContinue = vi.fn();

    renderComponent({ onContinue });

    fireEvent.click(screen.getByText(/hearingFormNext/i));

    expect(onContinue).toHaveBeenCalled();
  });
});
