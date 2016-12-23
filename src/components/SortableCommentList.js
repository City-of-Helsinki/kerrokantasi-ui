import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {get, throttle} from 'lodash';
import Waypoint from 'react-waypoint';
import CommentList from './CommentList';
import LoadSpinner from './LoadSpinner';
import * as Actions from '../actions';

// const ORDERING_CRITERIA = {
//   POPULARITY_ASC: 'n_votes',
//   POPULARITY_DESC: '-n_votes',
//   CREATED_AT_ASC: 'created_at',
//   CREATED_AT_DESC: '-created_at'
// };

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
      // displayVisualization,
      // postComment,
      section,
      sectionComments,
      // voteComment,
      ...rest
    } = this.props;

    const showCommentList = section && sectionComments && get(sectionComments, 'results');
    return (
      <div className="sortable-comment-list">
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
  fetchComments: (sectionId) => dispatch(
    Actions.fetchSectionComments(sectionId)
  ),
  fetchMoreComments: (sectionId, ordering, nextUrl) => dispatch(
    Actions.fetchMoreSectionComments(sectionId, ordering, nextUrl)
  ),
  postComment: () => console.log('todo'),
  voteComment: () => console.log('todo')
});

export default connect(mapStateToProps, mapDispatchToProps)(SortableCommentList);
