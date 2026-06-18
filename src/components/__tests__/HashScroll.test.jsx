import React from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HashScroll from '../HashScroll';

const renderWithHash = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <HashScroll />
    </MemoryRouter>
  );

describe('<HashScroll />', () => {
  let scrollIntoViewMock;

  beforeEach(() => {
    scrollIntoViewMock = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  });

  afterEach(() => {
    delete HTMLElement.prototype.scrollIntoView;
  });

  it('renders nothing', () => {
    const { container } = renderWithHash('/');
    expect(container.firstChild).toBeNull();
  });

  it('does not call scrollIntoView when there is no hash', () => {
    renderWithHash('/foo');
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('calls scrollIntoView with smooth behavior when hash matches an element', () => {
    const target = document.createElement('div');
    target.id = 'target';
    document.body.appendChild(target);

    renderWithHash('/foo#target');

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(target);
  });

  it('does not throw and does not call scrollIntoView when hash element is missing', () => {
    expect(() => renderWithHash('/foo#nonexistent')).not.toThrow();
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('calls scrollIntoView again when hash changes after mount', async () => {
    const first = document.createElement('div');
    first.id = 'section-1';
    const second = document.createElement('div');
    second.id = 'section-2';
    document.body.appendChild(first);
    document.body.appendChild(second);

    const NavigateTrigger = () => {
      const navigate = useNavigate();
      return <button onClick={() => navigate('/foo#section-2')}>go</button>;
    };

    render(
      <MemoryRouter initialEntries={['/foo#section-1']}>
        <HashScroll />
        <NavigateTrigger />
      </MemoryRouter>
    );

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'go' }));

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(2);
    expect(scrollIntoViewMock).toHaveBeenLastCalledWith({ behavior: 'smooth' });

    document.body.removeChild(first);
    document.body.removeChild(second);
  });
});
