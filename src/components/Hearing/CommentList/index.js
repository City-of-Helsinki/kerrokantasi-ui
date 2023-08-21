/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import Comment from '../Comment';

export class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * Determines whether a Comment's replies should be toggled open. Length based on amount of comments.
       * @type {boolean[]}
       */
      commentShowReplies: [...Array(this.props.comments.length)].map(() => false),
    };
  }

  componentDidUpdate(prevProps) {
    const { comments: newComments, section } = this.props;
    if (prevProps.section.id === section.id && prevProps.comments !== newComments) {
      const updatedLoadingState = newComments.reduce((acc, curr, index) => {
        /**
         * loadingSubComments is undefined by default, boolean true is added once we start fetching
         * replies made to that comment, boolean false added when replies have been successfully fetched.
         * @type {undefined | boolean}
         */
        const previousLoadingState = prevProps.comments[index].loadingSubComments;
        const currentLoadingState = curr.loadingSubComments;
        // if previously loading and now not loading -> true so the replies are visible once mounted, otherwise false.
        const nextLoadingState = (previousLoadingState && !currentLoadingState) || false;
        acc.push(nextLoadingState);
        return acc;
      }, []);
      // commentShowReplies has changed from the previous render and should be updated.
      const notSameAsPrevious = !this.state.commentShowReplies.every(
        (comment, index) => comment === updatedLoadingState[index]
      );
      if (notSameAsPrevious) {
        this.updateShowReplies(updatedLoadingState);
      }
    }
  }

  updateShowReplies = (param) => {
    this.setState({ commentShowReplies: param });
  }

  render() {
    const {
      comments,
      canComment,
      isLoading,
      section,
      canReply,
      canVote,
      canFlag,
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
          <p><FormattedMessage id="noCommentsAvailable" /></p>
        </div>
      );
    }
    return (
      <ul className="commentlist">
        {comments.map((comment, index) =>
          <Comment
            canReply={canReply}
            canVote={canVote}
            canFlag={canFlag}
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
            onPostFlag={this.props.onPostFlag}
            questions={section.questions}
            section={section}
            user={user}
            showReplies={this.state.commentShowReplies[index]}
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
  canFlag: PropTypes.bool,
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
  onPostFlag: PropTypes.func,
  section: PropTypes.object,
  user: PropTypes.object,
};

CommentList.defaultProps = {
  jumpTo: -1,
};

export default injectIntl(CommentList);
