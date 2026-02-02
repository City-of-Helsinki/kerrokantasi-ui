import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ConditionalWrap } from '../ConditionalWrap';

describe('ConditionalWrap', () => {
  it('should wrap children when condition is true', () => {
    const wrapper = (children) => <div data-testid="wrapper">{children}</div>;
    const { getByTestId, getByText } = render(
      <ConditionalWrap condition wrap={wrapper}>
        <span>Test content</span>
      </ConditionalWrap>
    );

    expect(getByTestId('wrapper')).toBeInTheDocument();
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('should not wrap children when condition is false', () => {
    const wrapper = (children) => <div data-testid="wrapper">{children}</div>;
    const { queryByTestId, getByText } = render(
      <ConditionalWrap condition={false} wrap={wrapper}>
        <span>Test content</span>
      </ConditionalWrap>
    );

    expect(queryByTestId('wrapper')).not.toBeInTheDocument();
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('should pass children correctly to wrapper function', () => {
    const wrapper = (children) => <strong data-testid="strong-wrapper">{children}</strong>;
    const { getByTestId } = render(
      <ConditionalWrap condition wrap={wrapper}>
        <em data-testid="emphasized">Emphasis</em>
      </ConditionalWrap>
    );

    expect(getByTestId('strong-wrapper')).toBeInTheDocument();
    expect(getByTestId('emphasized')).toBeInTheDocument();
  });
});
