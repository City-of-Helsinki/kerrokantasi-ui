import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import {get, keys, throttle} from 'lodash';
import Waypoint from 'react-waypoint';
import CommentList from './CommentList';
import LoadSpinner from './LoadSpinner';
import Icon from '../utils/Icon';
import MapdonKSVPlugin from './plugins/legacy/mapdon-ksv';
import * as Actions from '../actions';

const ORDERING_CRITERIA = {
  POPULARITY_ASC: 'n_votes',
  POPULARITY_DESC: '-n_votes',
  CREATED_AT_ASC: 'created_at',
  CREATED_AT_DESC: '-created_at'
};

class SortableCommentList extends Component {

  constructor() {
    super();

    this.state = {
      showLoader: false
    };

    this.fetchMoreComments = throttle(this._fetchMoreComments).bind(this);
    this.handleReachBottom = this.handleReachBottom.bind(this);
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

  componentWillReceiveProps(props) {
    this.setState({
      showLoader: get(props.sectionComments, 'isFetching')
    });
  }

  handleReachBottom() {
    const {sectionComments} = this.props;
    if (sectionComments && sectionComments.count !== sectionComments.results.length) {
      setTimeout(() => this.fetchMoreComments(), 1000);
      this.setState({showLoader: true});
    }
  }

  render() {
    const {
      displayVisualization,
      fetchComments,
      // postComment,
      section,
      sectionComments,
      // voteComment,
      ...rest
    } = this.props;

    const showCommentList = section && sectionComments && get(sectionComments, 'results');
    console.log(showCommentList, displayVisualization, get(sectionComments, 'plugin_data'));
    return (
      <div className="sortable-comment-list">
        <h2><FormattedMessage id="comments"/>
          <div className="commenticon">
            <Icon name="comment-o"/>&nbsp;{get(sectionComments, 'count') ? sectionComments.count : ''}
          </div>
        </h2>
        {
          (typeof window !== 'undefined') && showCommentList && displayVisualization && get(section, 'plugin_identifier') === 'mapdon-ksv' ?
            <div className="comments-visualization">
              <MapdonKSVPlugin
                data={section.plugin_data}
                pluginPurpose="viewComments"
                comments={sectionComments.results}
              />
              <div className="image-caption">Kaikki annetut kommentit sekä siirretyt ja lisätyt asemat kartalla.</div>
              <MapdonKSVPlugin
                data={section.plugin_data}
                pluginPurpose="viewHeatmap"
                comments={sectionComments.results}
              />
              <div className="image-caption">Siirrettyjen ja lisättyjen asemien tiheyskartta.</div>
            </div>
            : null
        }
        <form className="sort-selector">
          <FormGroup controlId="sort-select">
            <ControlLabel><FormattedMessage id="commentOrder"/></ControlLabel>
            <FormControl componentClass="select" onChange={(event) => { console.log(event.target.value); fetchComments(section.id, event.target.value); }}>
              {keys(ORDERING_CRITERIA).map((key) =>
                <option key={key} value={ORDERING_CRITERIA[key]} selected={ORDERING_CRITERIA[key] === get(sectionComments, 'ordering')}>
                  <FormattedMessage id={key}/>
                </option>)
              }
            </FormControl>
          </FormGroup>
        </form>

        { showCommentList &&
          <div>
            <CommentList
              section={section}
              comments={sectionComments.results}
              totalCount={sectionComments.count}
              {...rest}
            />
            <p className="sortable-comment-list__count">
              <FormattedMessage id="commentsOutOf" values={{current: sectionComments.results.length, total: sectionComments.count }}/>
            </p>
            <Waypoint onEnter={this.handleReachBottom}/>
          </div>
        }
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
  postComment: PropTypes.func,
  section: PropTypes.object,
  sectionComments: PropTypes.object,
  voteComment: PropTypes.func
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
  postComment: () => console.log('todo'),
  voteComment: () => console.log('todo')
});

export default connect(mapStateToProps, mapDispatchToProps)(SortableCommentList);
