import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HashScroll = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return null;
};

export default HashScroll;
