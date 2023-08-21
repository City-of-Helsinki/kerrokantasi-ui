/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import Button from 'react-bootstrap/lib/Button';
import logoWhite from '@city-images/logo-fi-white.svg';
import logoSwedishWhite from '@city-images/logo-sv-white.svg';

import PluginContent from '../../components/PluginContent';
import { getHearingWithSlug, getMainSection, getMainSectionComments } from '../../selectors/hearing';
import LoadSpinner from '../../components/LoadSpinner';
import getAttr from '../../utils/getAttr';
import { parseQuery } from '../../utils/urlQuery';
import {
  fetchHearing as fetchHearingAction,
  postSectionComment,
  postVote,
  postFlag,
  fetchAllSectionComments,
  fetchSectionComments,
  fetchMoreSectionComments,
} from '../../actions';
import Link from '../../components/LinkWithLang';
import Icon from '../../utils/Icon';
import { getUser } from '../../selectors/user';

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved

export class FullscreenHearingContainerComponent extends React.Component {
  UNSAFE_componentWillMount() {
    const {
      hearing,
      fetchHearing,
      match: { params },
    } = this.props;
    if (isEmpty(hearing)) {
      fetchHearing(params.hearingSlug);
    }
  }

  onPostComment = (text, authorName, pluginData, geojson, label, images) => {
    // Done
    const sectionCommentData = { text, authorName, pluginData, geojson, label, images };
    const { match, location, mainSection } = this.props;
    const { hearingSlug } = match.params;
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...sectionCommentData };
    return this.props.postSectionComment(hearingSlug, mainSection.id, commentData);
  };

  onVoteComment = (commentId) => {
    const { match, mainSection } = this.props;
    const { hearingSlug } = match.params;
    const sectionId = mainSection.id;
    this.props.postVote(commentId, hearingSlug, sectionId);
  };

  render() {
    const { hearing, mainSection, mainSectionComments, user, match, fetchAllComments, language } = this.props;
    const detailURL = `/${hearing.slug}`;

    return (
      <div id='hearing'>
        {isEmpty(hearing) ? (
          <LoadSpinner />
        ) : (
          <div className='fullscreen-hearing'>
            <div className='fullscreen-navigation'>
              <div className='logo'>
                <Link to={{ path: '/' }}>
                  <FormattedMessage id='fullscreenHeaderLogoAlt'>
                    {(altText) => (
                      <img alt={altText} src={language === 'sv' ? logoSwedishWhite : logoWhite} className='logo' />
                    )}
                  </FormattedMessage>
                </Link>
              </div>
              <div className='header-title'>
                <Link to={{ path: detailURL, state: { fromFullscreen: true } }}>
                  {getAttr(hearing.title, language)}
                </Link>
              </div>
              <div className='minimize'>
                <Link to={{ path: detailURL, state: { fromFullscreen: true } }}>
                  <Button>
                    <Icon name='compress' />
                  </Button>
                </Link>
              </div>
            </div>
            <div className='plugin-content'>
              <PluginContent
                hearingSlug={match.params.hearingSlug}
                fetchAllComments={fetchAllComments}
                section={mainSection}
                comments={mainSectionComments}
                onPostComment={this.onPostComment}
                onPostVote={this.onVoteComment}
                user={user}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

FullscreenHearingContainerComponent.propTypes = {
  hearing: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  mainSection: PropTypes.object,
  user: PropTypes.object,
  mainSectionComments: PropTypes.object,
  fetchHearing: PropTypes.func,
  postSectionComment: PropTypes.func,
  postVote: PropTypes.func,
  fetchAllComments: PropTypes.func,
  language: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  language: state.language,
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  mainSection: getMainSection(state, ownProps.match.params.hearingSlug),
  user: getUser(state),
  mainSectionComments: getMainSectionComments(state, ownProps.match.params.hearingSlug),
});

const mapDispatchToProps = (dispatch) => ({
  fetchHearing: (hearingSlug, preview = false) => dispatch(fetchHearingAction(hearingSlug, preview)),
  fetchAllComments: (hearingSlug, sectionId) => dispatch(fetchAllSectionComments(hearingSlug, sectionId)),
  postSectionComment: (hearingSlug, sectionId, commentData) =>
    dispatch(postSectionComment(hearingSlug, sectionId, commentData)),
  postVote: (commentId, hearingSlug, sectionId) => dispatch(postVote(commentId, hearingSlug, sectionId)),
  postFlag: (commentId, hearingSlug, sectionId) => dispatch(postFlag(commentId, hearingSlug, sectionId)),
  fetchCommentsForSortableList: (sectionId, ordering) => dispatch(fetchSectionComments(sectionId, ordering)),
  fetchMoreComments: (sectionId, ordering, nextUrl) => dispatch(fetchMoreSectionComments(sectionId, nextUrl, ordering)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FullscreenHearingContainerComponent));
