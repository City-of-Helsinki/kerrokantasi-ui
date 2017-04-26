import React, {Component, PropTypes} from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import {get, isEmpty, keys, throttle} from 'lodash';
import Waypoint from 'react-waypoint';
import CommentList from './CommentList';
import LoadSpinner from './LoadSpinner';
import Icon from '../utils/Icon';
import MapdonKSVPlugin from './plugins/legacy/mapdon-ksv';
import MapQuestionnaire from './plugins/MapQuestionnaire';
import * as Actions from '../actions';
import CommentForm from './CommentForm';

const ORDERING_CRITERIA = {
  CREATED_AT_DESC: '-created_at',
  CREATED_AT_ASC: 'created_at',
  POPULARITY_DESC: '-n_votes',
  POPULARITY_ASC: 'n_votes'
};

class SortableCommentList extends Component {

  constructor() {
    super();

    this.state = {
      showLoader: false
    };

    this.fetchMoreComments = throttle(this._fetchMoreComments).bind(this);
    this.handleReachBottom = this.handleReachBottom.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
  }

  _fetchMoreComments() {
    const {
      section: {id: sectionId},
      sectionComments: {ordering, next},
      fetchMoreComments
    } = this.props;

    if (next) {
      fetchMoreComments(sectionId, ordering, next);
    }
  }

  fetchComments(sectionId, ordering) {
    // if a plugin is involved, we must fetch all the comments for display, not just a select few
    const {fetchComments, fetchAllComments, section, hearingSlug} = this.props;
    if (section.plugin_identifier) {
      return fetchAllComments(hearingSlug, sectionId, ordering);
    }
    return fetchComments(sectionId, ordering);
  }

  componentDidMount() {
    console.log('list did mount');
    const { section } = this.props;
    this.fetchComments(section.id, ORDERING_CRITERIA.POPULARITY_DESC);
  }

  componentWillReceiveProps(nextProps) {
    const {section } = this.props;

    this.setState({
      showLoader: get(nextProps.sectionComments, 'isFetching')
    });

    if (!this.props.user && nextProps.user) {
      this.fetchComments(section.id, ORDERING_CRITERIA.POPULARITY_DESC);
    }

    if (this.props.user && !nextProps.user) {
      this.fetchComments(section.id, ORDERING_CRITERIA.POPULARITY_DESC);
    }

    if (section.id !== nextProps.section.id) {
      this.fetchComments(nextProps.section.id, ORDERING_CRITERIA.POPULARITY_DESC);
    }
  }

  onPostHearingComment(text, authorName, pluginData, geojson, label, images) { // eslint-disable-line
    const { postComment } = this.props;
    const hearingSlug = this.props.hearingSlug;
    const { authCode } = this.props.location.query;
    const mainSection = this.props.mainSection;
    const commentData = { text, authorName, pluginData: null, authCode, geojson: null, label: null, images };
    postComment(hearingSlug, mainSection.id, commentData);
  }

  onPostSectionComment(sectionId, sectionCommentData) {
    const {postComment} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = this.props.location.query;
    const commentData = Object.assign({authCode}, sectionCommentData);
    postComment(hearingSlug, sectionId, commentData);
  }

  onVoteComment(commentId, sectionId) {
    const {postVote} = this.props;
    const hearingSlug = this.props.hearingSlug;
    postVote(commentId, hearingSlug, sectionId);
  }

  handleReachBottom() {
    const {sectionComments} = this.props;
    if (sectionComments && sectionComments.count !== sectionComments.results.length) {
      setTimeout(() => this.fetchMoreComments(), 1000);
      this.setState({showLoader: true});
    }
  }

  renderMapVisualization() {
    const {section, sectionComments} = this.props;
    return (
      <div>
        <MapQuestionnaire
          data={section.plugin_data}
          pluginPurpose="viewHeatmap"
          comments={sectionComments}
          pluginSource={section.plugin_iframe_url}
        />
        <div className="image-caption">Kaikkien merkintöjen ja äänien tiheyskartta.</div>
      </div>
    );
  }

  renderPluginContent() {
    const {section} = this.props;
    const {comments} = this.props.sectionComments.results;
    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return null;
    }
    switch (section.plugin_identifier) {
      case "mapdon-ksv":
        // This is legacy support.
        return (
          <div>
            <MapdonKSVPlugin
              data={section.plugin_data}
              pluginPurpose="viewComments"
              comments={comments}
            />
            <div className="image-caption">Kaikki annetut kommentit sekä siirretyt ja lisätyt asemat kartalla.</div>
            <MapdonKSVPlugin
              data={section.plugin_data}
              pluginPurpose="viewHeatmap"
              comments={comments}
            />
            <div className="image-caption">Siirrettyjen ja lisättyjen asemien tiheyskartta.</div>
          </div>
        );
      case "map-questionnaire":
        // Only display visualization if the plugin allows non-fullscreen rendering
        if (!section.plugin_fullscreen) {
          return this.renderMapVisualization();
        }
        return null;
      default:
        return null; // The plugin does not support result visualization.
    }
  }

  render() {
    const {
      displayVisualization,
      hearingId,
      canComment,
      // postComment,
      section,
      sectionComments,
      canVote,
      onPostComment,
      // voteComment,
      ...rest
    } = this.props;

    const showCommentList = section &&
      sectionComments &&
      get(sectionComments, 'results') &&
      !isEmpty(sectionComments.results);
    const commentForm =
      canComment ?
        (<CommentForm
        hearingId={hearingId}
        onPostComment={!onPostComment ? this.this.onPostHearingComment.bind(this) : onPostComment}
        canSetNickname={this.props.canSetNickname}
        />) : null;
    const pluginContent = (showCommentList && displayVisualization ? this.renderPluginContent() : null);
    return (
      <div className="sortable-comment-list">
        {showCommentList && <h2><FormattedMessage id="comments"/>
          <div className="commenticon">
            <Icon name="comment-o"/>&nbsp;{get(sectionComments, 'count') ? sectionComments.count : ''}
          </div>
        </h2>}
        {commentForm}
        {pluginContent}

        {showCommentList && <form className="sort-selector">
          <FormGroup controlId="sort-select">
            <ControlLabel><FormattedMessage id="commentOrder"/></ControlLabel>
            <FormControl
              componentClass="select"
              onChange={(event) => { this.fetchComments(section.id, event.target.value); }}
            >
              {keys(ORDERING_CRITERIA).map((key) =>
                <option
                  key={key}
                  value={ORDERING_CRITERIA[key]}
                  selected={ORDERING_CRITERIA[key] === get(sectionComments, 'ordering')}
                >
                  <FormattedMessage id={key}/>
                </option>)
              }
            </FormControl>
          </FormGroup>
        </form>}
        {showCommentList && <div>
          <CommentList
            canVote={canVote}
            section={section}
            comments={sectionComments.results}
            totalCount={sectionComments.count}
            onPostComment={this.onPostHearingComment.bind(this)}
            onPostVote={this.onVoteComment.bind(this)}
            isLoading={this.state.showLoader}
            {...rest}
          />
          <p className="sortable-comment-list__count">
            <FormattedMessage
              id="commentsOutOf" values={{
                current: sectionComments.results.length,
                total: sectionComments.count,
              }}
            />
          </p>
          <Waypoint onEnter={this.handleReachBottom}/>
        </div>}
        {this.state.showLoader ?
          <div className="sortable-comment-list__loader">
            <LoadSpinner />
          </div>
          : null
        }
      </div>
    );
  }
}

SortableCommentList.propTypes = {
  displayVisualization: PropTypes.bool,
  fetchComments: PropTypes.func,
  fetchMoreComments: PropTypes.func,
  fetchAllComments: PropTypes.func,
  postComment: PropTypes.func,
  section: PropTypes.object,
  sectionComments: PropTypes.object,
  voteComment: PropTypes.func,
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  hearingSlug: React.PropTypes.string,
  language: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  postVote: React.PropTypes.func,
  canVote: React.PropTypes.bool,
  mainSection: React.PropTypes.object,
  isSectionComments: React.PropTypes.bool,
  canSetNickname: React.PropTypes.bool,
  canComment: React.PropTypes.bool,
  hearingId: React.PropTypes.string,
  onPostComment: React.PropTypes.func
};

const mapStateToProps = (state, {section: {id: sectionId}}) => ({
  sectionComments: get(state, `sectionComments.${sectionId}`)
});

const mapDispatchToProps = (dispatch) => ({
  fetchComments: (sectionId, ordering) => dispatch(
    Actions.fetchSectionComments(sectionId, ordering)
  ),
  fetchMoreComments: (sectionId, ordering, nextUrl) => dispatch(
    Actions.fetchMoreSectionComments(sectionId, ordering, nextUrl)
  ),
  fetchAllComments: (hearingSlug, sectionId, ordering) => dispatch(
    Actions.fetchAllSectionComments(hearingSlug, sectionId, ordering)
  ),
  postComment: (hearingSlug, sectionId, commentData) => dispatch(
    Actions.postSectionComment(hearingSlug, sectionId, commentData)
  ),
  postVote: (commentId, hearingSlug, sectionId) => dispatch(
    Actions.postVote(commentId, hearingSlug, sectionId)
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(SortableCommentList);
