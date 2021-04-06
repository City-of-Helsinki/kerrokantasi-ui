import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/*
 * Purpose of this component is to allow keyboard clicks only
 * and to not show the element as a link for keyboard and screen
 * reader users making it just a decorative "link" for sighted
 * mouse users.
 */

/* eslint-disable jsx-a11y/click-events-have-key-events */

const MouseOnlyLink = (props) => {
  const {
    children,
    className,
    history,
    headless,
    language,
    location,
    style,
    url,
  } = props;
  const combinedUrl = `${url}?headless=${headless}&lang=${language}`;

  const handleClick = (event, path) => {
    event.preventDefault();
    return history.push(path);
  };

  if (isEmpty(children)) {
    return (
      <div
        className={`mouse-only-click-element ${className}`}
        style={style}
        onClick={(event) => handleClick(event, url + location.search)}
      />
    );
  }

  return (
    <div
      className={`mouse-only-click-element ${className}`}
      style={style}
      onClick={(event) => handleClick(event, combinedUrl)}
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
  history: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  style: PropTypes.object,
  url: PropTypes.string,
};

const mapStateToProps = (state) => ({
  language: state.language,
  headless: state.headless
});

export default withRouter(connect(mapStateToProps)(MouseOnlyLink));
