import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from '../components/Hearing/Comment';

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
      <div className="commentlist">
        {comments.map((comment) =>
          <Comment
            canReply={canReply}
            canVote={this.props.canVote}
            data={comment}
            defaultNickname={defaultNickname}
            hearingId={hearingId}
            key={comment.id + Math.random()}
            language={language}
            nicknamePlaceholder={nicknamePlaceholder}
            onDeleteComment={this.props.onDeleteComment}
            onEditComment={this.props.onEditComment}
            onPostReply={this.props.onPostReply}
            onPostVote={this.props.onPostVote}
            questions={section.questions}
            section={section}
            user={user}
          />
        )}
      </div>
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
  language: PropTypes.string,
  nicknamePlaceholder: PropTypes.string,
  onDeleteComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onPostReply: PropTypes.func,
  onPostVote: PropTypes.func,
  section: PropTypes.object,
  user: PropTypes.object,
};

export default injectIntl(CommentList);
