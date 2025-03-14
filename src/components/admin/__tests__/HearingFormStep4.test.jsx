import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';
import moment from 'moment';

import HearingFormStep4 from '../HearingFormStep4';
import renderWithProviders from '../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (propOverrides) => {
  const props = {
    hearing: {},
    hearingLanguages: ['fi', 'sv', 'en'],
    formatMessage: vi.fn((msg) => msg.id),
    errors: {},
    onSectionChange: vi.fn(),
    onHearingChange: vi.fn(),
    onContinue: vi.fn(),
    dispatch: vi.fn(),
    ...propOverrides,
  };

  const store = mockStore({});

  return renderWithProviders(<HearingFormStep4 {...props} />, { store });
};

describe('<HearingFormStep4 />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should handle date change', () => {
    const onHearingChange = vi.fn();

    renderComponent({ onHearingChange });

    const newDate = moment().add(1, 'days').format('DD.M.YYYY');

    fireEvent.change(screen.getByLabelText(/hearingOpeningDate/i), { target: { value: newDate } });

    expect(onHearingChange).toHaveBeenCalledWith('open_at', expect.any(String));
  });

  it('should handle time change', () => {
    const onHearingChange = vi.fn();

    renderComponent({ onHearingChange });

    const hoursInput = screen.getAllByLabelText(/Tunti/i)[0];
    const minutesInput = screen.getAllByLabelText(/Minuutti/i)[0];

    fireEvent.change(hoursInput, { target: { value: '12' } });
    fireEvent.change(minutesInput, { target: { value: '00' } });

    expect(onHearingChange).toHaveBeenCalledWith('open_at', expect.any(String));
  });

  it('should call onContinue when the button is clicked', () => {
    const onContinue = vi.fn();

    renderComponent({ onContinue });

    fireEvent.click(screen.getByText('hearingFormNext'));

    expect(onContinue).toHaveBeenCalled();
  });
});
