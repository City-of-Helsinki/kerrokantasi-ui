/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

/*
 * Purpose of this component is to allow keyboard clicks only
 * and to not show the element as a link for keyboard and screen
 * reader users making it just a decorative "link" for sighted
 * mouse users.
 */

/* eslint-disable jsx-a11y/click-events-have-key-events */

const MouseOnlyLink = (props) => {
  const { children, className, headless, language, style, url, altText } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const combinedUrl = `${url}?headless=${headless}&lang=${language}`;

  const defineImageAlt = () => altText || '';

  const handleClick = (event, path) => {
    event.preventDefault();
    return navigate(path);
  };

  if (isEmpty(children)) {
    return (
      <div
        className={`mouse-only-click-element ${className}`}
        style={style}
        onClick={(event) => handleClick(event, url + location.search)}
        alt={defineImageAlt()}
      />
    );
  }

  return (
    <div
      className={`mouse-only-click-element ${className}`}
      style={style}
      onClick={(event) => handleClick(event, combinedUrl)}
      alt={defineImageAlt()}
    >
      {children}
    </div>
  );
};

/* eslint-enable jsx-a11y/click-events-have-key-events */

MouseOnlyLink.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  headless: PropTypes.bool,
  language: PropTypes.string,
  style: PropTypes.object,
  url: PropTypes.string,
  altText: PropTypes.string,
};

const mapStateToProps = (state) => ({
  language: state.language,
  headless: state.headless,
});

export default connect(mapStateToProps)(MouseOnlyLink);
