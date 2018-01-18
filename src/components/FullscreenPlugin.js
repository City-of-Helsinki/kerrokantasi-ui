import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Section} from './Section';
import {injectIntl, intlShape} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../utils/Icon';
import PluginContent from './PluginContent';

class FullscreenPlugin extends Section {
  render() {
    const {section, comments, user, hearingSlug} = this.props;
    return (
      <div>
        <div className="fullscreen-navigation">
          <div className="logo">
            <Link to="/">
              <img alt="Helsinki" src="/assets/images/helsinki-logo-white.svg" className="logo" />
            </Link>
          </div>
          <div className="header-title">
            <Link to={this.props.detailURL}>{this.props.headerTitle}</Link>
          </div>
          <div className="minimize">
            <Link to={this.props.detailURL}>
              <Button>
                <Icon name="compress" />
              </Button>
            </Link>
          </div>
        </div>
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