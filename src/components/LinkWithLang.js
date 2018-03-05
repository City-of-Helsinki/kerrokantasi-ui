import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import {parseQuery} from '../utils/urlQuery';

/*
 * THIS COMPONENT SHOULD BE ALWAYS USED INSTEAD OF VANILLA <Link /> from react-router.
 * Purpose of this component is to allow url's search to change and represent current
 * language without having to use redirection (which will make navigating with browsers
 * back button awkward or impossible) and without breaking old links.
 */

class LinkWithLangComponent extends React.Component {
  render() {
    const {to, className, children, language, style, headless} = this.props;
    let searchString = to.search;
    const urlHeadless = parseQuery(searchString).headless;
    // update search string with headless param preserved if site is being rendered in webview
    if (!urlHeadless || urlHeadless !== 'true' || urlHeadless !== 'false') {
      searchString = `${searchString ? searchString + `&headless=${headless}` : `?headless=${language}`}`;
    }
    const newTo = {
      pathname: to.path,
      search: `${searchString ? searchString + `&lang=${language}` : `?lang=${language}`}`,
      hash: to.hash || '',
      state: to.state || {}
    };
    return (
      <Link className={className} to={newTo} style={style}>{children}</Link>
    );
  }
}

LinkWithLangComponent.propTypes = {
  to: PropTypes.shape({
    path: PropTypes.string.isRequired,
    search: PropTypes.string
  }).isRequired,
  children: PropTypes.any,
  className: PropTypes.string,
  language: PropTypes.string,
  style: PropTypes.object,
  headless: PropTypes.bool,
  dispatch: PropTypes.func
};

const mapStateToProps = (state) => ({
  language: state.language,
  headless: state.headless
});

export default withRouter(connect(mapStateToProps)(LinkWithLangComponent));
