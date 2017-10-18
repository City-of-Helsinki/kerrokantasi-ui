import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Section} from './Section';
import {injectIntl, intlShape} from 'react-intl';
import PluginContent from './PluginContent';
import FullscreenNavigation from './FullscreenNavigation';

class FullscreenPlugin extends Section {
  onLogin = () => {
    this.props.dispatch(login());
  };

  onSelect = eventKey => {
    switch (eventKey) {
      case 'login':
        // TODO: Actual login flow
        this.props.dispatch(login());
        break;
      case 'logout':
        // TODO: Actual logout flow
        this.props.dispatch(logout());
        break;
      default:
      // Not sure what to do here
    }
  };

  render() {
    const {section, comments, user, hearingSlug, headerTitle, detailURL} = this.props;
    const openDetailPage = () => this.props.dispatch(push(this.props.detailURL));
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

export default injectIntl(FullscreenPlugin);
