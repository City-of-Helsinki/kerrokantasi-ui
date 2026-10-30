import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const Waypoint = ({ onEnter }) => {
  const ref = useRef(null);
  // Keep the latest callback in a ref so the observer does not have to be
  // recreated (and re-fire immediately) every time the parent re-renders.
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && onEnterRef.current) onEnterRef.current();
    });

    io.observe(node);

    return () => {
      io.disconnect();
    };
  }, []);

  return <div ref={ref} aria-hidden='true' />;
};

Waypoint.propTypes = {
  onEnter: PropTypes.func,
};
