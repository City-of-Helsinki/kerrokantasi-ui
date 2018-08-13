import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from './Comment';

export class CommentList extends React.Component {
  render() {
    const {comments, canComment, isLoading, section} = this.props;
    if (comments.length === 0) {
      if (!canComment || isLoading) {
        return null;  // No need to show a header for nothing at all.
      }
      return (
        <div className="commentlist">
          <p><FormattedMessage id="noCommentsAvailable"/></p>
        </div>
      );
    }
    return (
      <div className="commentlist">
        <p><FormattedMessage id="showingNumComments"/>: 100</p>
        {comments.slice(0, 100).map((comment) =>
          <Comment
            data={comment}
            onEditComment={this.props.onEditComment}
            onDeleteComment={this.props.onDeleteComment}
            key={comment.id + Math.random()}
            onPostVote={this.props.onPostVote}
            canVote={this.props.canVote}
            questions={section.questions}
          />
        )}
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.array,
  canComment: PropTypes.bool,
  canVote: PropTypes.bool,
  onEditComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  onPostVote: PropTypes.func,
  isLoading: PropTypes.bool,
  section: PropTypes.object
};

export default injectIntl(CommentList);
