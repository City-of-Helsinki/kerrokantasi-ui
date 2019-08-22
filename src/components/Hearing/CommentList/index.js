import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from '../Comment';

export class CommentList extends React.Component {
  render() {
    const {
      comments,
      canComment,
      isLoading,
      section,
      canReply,
      user,
      defaultNickname,
      nicknamePlaceholder,
      language,
      hearingId,
    } = this.props;
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
      <ul className="commentlist">
        {comments.map((comment) =>
          <Comment
            canReply={canReply}
            canVote={this.props.canVote}
            data={comment}
            defaultNickname={defaultNickname}
            hearingId={hearingId}
            key={comment.id + Math.random()}
            jumpTo={this.props.jumpTo}
            language={language}
            nicknamePlaceholder={nicknamePlaceholder}
            onDeleteComment={this.props.onDeleteComment}
            onEditComment={this.props.onEditComment}
            onGetSubComments={this.props.onGetSubComments}
            onPostReply={this.props.onPostReply}
            onPostVote={this.props.onPostVote}
            questions={section.questions}
            section={section}
            user={user}
          />
        )}
      </ul>
    );
  }
}

CommentList.propTypes = {
  canComment: PropTypes.bool,
  canReply: PropTypes.bool,
  canVote: PropTypes.bool,
  comments: PropTypes.array,
  defaultNickname: PropTypes.string,
  hearingId: PropTypes.string,
  isLoading: PropTypes.bool,
  jumpTo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  language: PropTypes.string,
  nicknamePlaceholder: PropTypes.string,
  onDeleteComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onGetSubComments: PropTypes.func,
  onPostReply: PropTypes.func,
  onPostVote: PropTypes.func,
  section: PropTypes.object,
  user: PropTypes.object,
};

CommentList.defaultProps = {
  jumpTo: -1,
};

export default injectIntl(CommentList);
