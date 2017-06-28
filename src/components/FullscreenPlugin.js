import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import {Section} from './Section';
import {injectIntl, intlShape} from 'react-intl';
import {Link} from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../utils/Icon';
import PluginContent from './PluginContent';
import {fetchAllSectionComments} from "../actions/index";


class FullscreenPlugin extends Section {

  render() {
    const {section, comments, user, hearingSlug} = this.props;
    const openDetailPage = () => this.props.dispatch(push(this.props.detailURL));
    return (
      <div>
        <div className="fullscreen-navigation">
          <div className="logo">
            <Link to="/">
              <img alt="City of Helsinki" src="/assets/images/helsinki-coat-of-arms-white-big.png"/>
            </Link>
          </div>
          <div className="header-title">
            <Link to={this.props.detailURL}>
              {this.props.headerTitle}
            </Link>
          </div>
          <div className="minimize">
            <Button onClick={openDetailPage}>
              <Icon name="compress"/>
            </Button>
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
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  comments: React.PropTypes.object,
  detailURL: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func,
  headerTitle: React.PropTypes.string,
  hearingSlug: React.PropTypes.string,
  intl: intlShape.isRequired,
  loadSectionComments: React.PropTypes.func,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  section: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  fetchAllComments: (hearingSlug, sectionId) => dispatch(
    fetchAllSectionComments(hearingSlug, sectionId)
  ),
  dispatch
});

export default connect(null, mapDispatchToProps)(injectIntl(FullscreenPlugin));
