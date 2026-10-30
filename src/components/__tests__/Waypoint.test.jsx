import { cleanup, render } from '@testing-library/react';

import { Waypoint } from '../Waypoint';

describe('Waypoint', () => {
  let observers;

  beforeEach(() => {
    observers = [];

    class MockIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
        this.disconnect = vi.fn();
        observers.push(this);
      }

      observe() {}
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('rechecks the waypoint when the reset key changes', () => {
    const firstOnEnter = vi.fn();
    const latestOnEnter = vi.fn();
    const { rerender } = render(
      <Waypoint onEnter={firstOnEnter} resetKey='first-page' />
    );

    observers[0].callback([{ isIntersecting: true }]);
    expect(firstOnEnter).toHaveBeenCalledTimes(1);

    rerender(<Waypoint onEnter={latestOnEnter} resetKey='first-page' />);

    expect(observers).toHaveLength(1);
    observers[0].callback([{ isIntersecting: true }]);
    expect(firstOnEnter).toHaveBeenCalledTimes(1);
    expect(latestOnEnter).toHaveBeenCalledTimes(1);

    rerender(<Waypoint onEnter={latestOnEnter} resetKey='second-page' />);

    expect(observers).toHaveLength(2);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    observers[1].callback([{ isIntersecting: true }]);
    expect(latestOnEnter).toHaveBeenCalledTimes(2);
  });
});
