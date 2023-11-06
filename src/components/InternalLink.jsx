import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function InternalLink({ children, destinationId, srOnly, className }) {
  return (
    <AnchorLink className={classNames(srOnly ? 'internal-link hidden-link' : 'internal-link', className)} href={`#${destinationId}`} offset='100'>
      {children}
    </AnchorLink>
  );
}

InternalLink.defaultProps = {
  srOnly: false,
};

InternalLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  destinationId: PropTypes.string.isRequired,
  srOnly: PropTypes.bool,
  className: PropTypes.string,
};

export default InternalLink;
