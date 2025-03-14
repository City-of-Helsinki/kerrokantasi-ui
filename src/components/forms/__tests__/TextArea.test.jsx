/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { fireEvent } from '@testing-library/react';

import TextArea from '../TextArea';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (props) => renderWithProviders(<TextArea {...props} />);

describe('<TextArea />', () => {
  it('renders correctly', () => {
    renderComponent({ value: 'Initial Value', labelId: 'label.test' });
  });

  it('calls onBlur function when blurred', () => {
    const onBlurMock = vi.fn();

    const { getByRole } = renderComponent({ onBlur: onBlurMock, labelId: 'label.test' });

    const textArea = getByRole('textbox');

    fireEvent.blur(textArea);

    expect(onBlurMock).toHaveBeenCalled();
  });

  it('updates value on change', () => {
    const { getByRole } = renderComponent({ value: '', labelId: 'label.test' });

    const textArea = getByRole('textbox');

    fireEvent.change(textArea, { target: { value: 'New Value' } });

    expect(textArea.value).toBe('New Value');
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = renderComponent({ placeholderId: 'placeholder.test', labelId: 'label.test' });

    expect(getByPlaceholderText('placeholder.test')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    const { getByText } = renderComponent({ helperText: 'Helper Text', labelId: 'label.test' });

    expect(getByText('Helper Text')).toBeInTheDocument();
  });

  it('renders with hint', () => {
    const { getByText } = renderComponent({ hint: 'Hint Text', labelId: 'label.test' });

    expect(getByText('(Hint Text)')).toBeInTheDocument();
  });

  it('renders with required attribute', () => {
    const { getByRole } = renderComponent({ required: true, labelId: 'label.test' });

    const textArea = getByRole('textbox');

    expect(textArea).toBeRequired();
  });

  it('renders with maxLength attribute', () => {
    const { getByRole } = renderComponent({ maxLength: 10, labelId: 'label.test' });

    const textArea = getByRole('textbox');

    expect(textArea).toHaveAttribute('maxLength', '10');
  });
});
