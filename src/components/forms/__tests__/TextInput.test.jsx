import React from 'react';
import { fireEvent } from '@testing-library/react';

import TextInput from '../TextInput';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    error: '',
    hint: 'Hint text',
    labelId: 'label.id',
    name: 'test-input',
    maxLength: 100,
    required: true,
    value: '',
    helperText: 'Helper text',
    placeholderId: 'placeholder.id',
    onBlur: vi.fn(),
    validate: vi.fn(),
    intl: { formatMessage: vi.fn(({ id }) => id) },
    ...propOverrides,
  };

  return renderWithProviders(<TextInput {...props} />);
};

describe('<TextInput />', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('displays the correct label and hint', () => {
    const { getByText } = renderComponent();

    expect(getByText(/label.id/i)).toBeInTheDocument();
    expect(getByText(/Hint text/i)).toBeInTheDocument();
  });

  it('displays the correct placeholder', () => {
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText(/placeholder.id/i)).toBeInTheDocument();
  });

  it('calls onBlur function when input loses focus', () => {
    const onBlurMock = vi.fn();

    const { getByLabelText } = renderComponent({ onBlur: onBlurMock });
    const input = getByLabelText(/label.id/i);

    fireEvent.blur(input);

    expect(onBlurMock).toHaveBeenCalled();
  });

  it('validates input value on change', () => {
    const validateMock = vi.fn();

    const { getByLabelText } = renderComponent({ validate: validateMock });

    const input = getByLabelText(/label.id/i);

    fireEvent.change(input, { target: { value: 'new value' } });

    expect(validateMock).toHaveBeenCalledWith('new value');
  });

  it('displays error message when validation fails', () => {
    const validateMock = vi.fn().mockReturnValue('Validation error');

    const { getByLabelText, getByText } = renderComponent({ validate: validateMock });

    const input = getByLabelText(/label.id/i);

    fireEvent.change(input, { target: { value: 'invalid value' } });

    expect(getByText(/Validation error/i)).toBeInTheDocument();
  });

  it('displays helper text', () => {
    const { getByText } = renderComponent();

    expect(getByText(/Helper text/i)).toBeInTheDocument();
  });
});
