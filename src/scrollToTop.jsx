import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({children}) => {
  const location = useLocation();
  useEffect(() => {
    // Scroll to top on initial render
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
}


ScrollToTop.propTypes = {
  children: PropTypes.object,
};

export default ScrollToTop;
