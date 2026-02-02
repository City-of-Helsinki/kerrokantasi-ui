import React from 'react';
import PropTypes from 'prop-types';

import { sanitizeHtml } from '../../utils/externalContent';

/**
 * Component that renders sanitized HTML content.
 * Uses DOMPurify to sanitize HTML and html-react-parser to convert it to React elements.
 *
 * @param {Object} props - Component props
 * @param {string} props.html - HTML string to sanitize and render
 * @param {boolean} [props.allowIframes=false] - Whether to preserve iframe tags in the HTML
 * @returns {React.ReactNode} Sanitized HTML as React elements
 */
const SanitizedHtml = ({ html, allowIframes = false }) => {
  const content = React.useMemo(
    () => sanitizeHtml(html, allowIframes),
    [html, allowIframes]
  );

  return <>{content}</>;
};

SanitizedHtml.propTypes = {
  html: PropTypes.string,
  allowIframes: PropTypes.bool,
};

export default SanitizedHtml;
