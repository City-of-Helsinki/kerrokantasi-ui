import React from 'react';
import { HashLink } from 'react-router-hash-link';
import PropTypes from 'prop-types';

function InternalLink({children, destinationId, srOnly}) {
  const skipTo = `${window.location.pathname}${window.location.search}#${destinationId}`;
  return (
    <HashLink className={srOnly ? 'sr-only' : undefined} to={skipTo}>
      {children}
    </HashLink>
  );
}

InternalLink.defaultProps = {
  srOnly: false
};

InternalLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node]).isRequired,
  destinationId: PropTypes.string.isRequired,
  srOnly: PropTypes.bool
};

export default InternalLink;
