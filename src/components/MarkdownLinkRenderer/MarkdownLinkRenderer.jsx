import React from 'react';
import PropTypes from 'prop-types';

const MarkdownLinkRenderer = ({ href, children }) => {
  return (
    <a href={href} target='_self' rel={undefined}>
      {children}
    </a>
  );
};

MarkdownLinkRenderer.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

export default MarkdownLinkRenderer;
