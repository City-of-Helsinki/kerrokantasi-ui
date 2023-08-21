/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

import { parseQuery } from '../utils/urlQuery';

/*
 * THIS COMPONENT SHOULD BE ALWAYS USED INSTEAD OF VANILLA <Link /> from react-router.
 * Purpose of this component is to allow url's search to change and represent current
 * language without having to use redirection (which will make navigating with browsers
 * back button awkward or impossible) and without breaking old links.
 */

const LinkWithLangComponent = (props) => {
  const { to, className, children, style, headless, location } = props;
  let searchString = to.search || location.search;
  const urlHeadless = parseQuery(searchString).headless;
  // update search string with headless param preserved if site is being rendered in webview
  if (!urlHeadless) {
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    searchString = `${searchString ? `${searchString}&headless=${headless}` : `?headless=${headless}`}`;
  }
  const newTo = {
    pathname: to.path,
    search: searchString,
    hash: to.hash || '',
    state: to.state || {},
  };

  return (
    <Link className={className} to={newTo} style={style}>
      {children}
    </Link>
  );
};

LinkWithLangComponent.propTypes = {
  to: PropTypes.shape({
    hash: PropTypes.string,
    state: PropTypes.object,
    path: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  children: PropTypes.any,
  className: PropTypes.string,
  location: PropTypes.object,
  style: PropTypes.object,
  headless: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  language: state.language,
  headless: state.headless,
});

export default withRouter(connect(mapStateToProps)(LinkWithLangComponent));
