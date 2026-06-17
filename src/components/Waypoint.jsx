import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const Waypoint = ({ onEnter }) => {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !onEnter) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onEnter();
    });
    io.observe(node);
    return () => io.disconnect();
  }, [onEnter]);
  return <div ref={ref} aria-hidden='true' />;
};

Waypoint.propTypes = {
  onEnter: PropTypes.func,
};
