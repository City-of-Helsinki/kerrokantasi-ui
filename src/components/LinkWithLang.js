import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

/*
 * THIS COMPONENT SHOULD BE ALWAYS USED INSTEAD OF VANILLA <Link /> from react-router.
 * Purpose of this component is to allow url's search to change and represent current
 * language without having to use redirection (which will make navigating with browsers
 * back button awkward or impossible) and without breaking old links.
 */

class LinkWithLangComponent extends React.Component {
  render() {
    const {to, className, children, language} = this.props;
    const newTo = {
      pathname: to.path,
      search: `${to.search ? to.search + `&lang=${language}` : `?lang=${language}`}`,
      hash: to.hash || '',
      state: to.state || {}
    };

    return (
      <Link className={className} to={newTo}>{children}</Link>
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
  language: PropTypes.string
};

const mapStateToProps = (state) => ({
  language: state.language
});

export default withRouter(connect(mapStateToProps)(LinkWithLangComponent));
