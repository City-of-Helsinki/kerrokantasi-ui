import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {injectIntl, intlShape} from 'react-intl';
import PluginContent from './PluginContent';
import FullscreenNavigation from './FullscreenNavigation';
import {login, logout} from '../actions';

class FullscreenPlugin extends Section {
  onLogin = () => {
    this.props.login();
  };

  onSelect = eventKey => {
    switch (eventKey) {
      case 'login':
        // TODO: Actual login flow
        this.props.login();
        break;
      case 'logout':
        // TODO: Actual logout flow
        this.props.logout();
        break;
      default:
      // Not sure what to do here
    }
  };

  render() {
    const {section, comments, user, hearingSlug, headerTitle, detailURL} = this.props;
    const openDetailPage = () => this.props.history.push(this.props.detailURL);
    return (
      <div>
        <FullscreenNavigation
          headerTitle={headerTitle}
          onLogin={this.onSelect}
          detailURL={detailURL}
          openDetailPage={openDetailPage}
          user={user}
        />
        {/* <FullscreenMobileNavigation headerTitle={headerTitle} onSelect={this.onSelect} detailURL={detailURL} /> */}
        <div className="plugin-content">
          <PluginContent
            hearingSlug={hearingSlug}
            fetchAllComments={this.props.fetchAllComments}
            section={section}
            comments={comments}
            onPostComment={this.onPostComment.bind(this)}
            onPostVote={this.onPostVote.bind(this)}
            user={user}
          />
        </div>
      </div>
    );
  }
}

FullscreenPlugin.defaultProps = {
  showPlugin: true,
  isCollapsible: false,
};

FullscreenPlugin.propTypes = {
  canComment: PropTypes.bool,
  canVote: PropTypes.bool,
  comments: PropTypes.object,
  detailURL: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
  headerTitle: PropTypes.string,
  intl: intlShape.isRequired,
  loadSectionComments: PropTypes.func,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  section: PropTypes.object.isRequired,
  user: PropTypes.object,
  fetchAllComment: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(login()),
  logout: () => dispatch(logout()),
  dispatch,
});

export default withRouter(connect(null, mapDispatchToProps)(injectIntl(FullscreenPlugin)));
