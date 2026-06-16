/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable sonarjs/no-uniq-key */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Comment from '../Comment';

export function CommentList({
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
  jumpTo = -1,
  onDeleteComment,
  onEditComment,
  onGetSubComments,
  onPostReply,
  onPostVote,
  onPostFlag,
}) {
  const [commentShowReplies, setCommentShowReplies] = useState(() =>
    [...Array(comments.length)].map(() => false)
  );

  const prevCommentsRef = useRef(comments);
  const prevSectionIdRef = useRef(section.id);

  useEffect(() => {
    const prevComments = prevCommentsRef.current;
    const prevSectionId = prevSectionIdRef.current;

    if (prevSectionId === section.id && prevComments !== comments) {
      const updatedLoadingState = comments.reduce((acc, curr, index) => {
        const previousLoadingState = prevComments[index]?.loadingSubComments;
        const currentLoadingState = curr?.loadingSubComments;
        const nextLoadingState =
          (previousLoadingState && !currentLoadingState) || false;
        acc.push(nextLoadingState);
        return acc;
      }, []);

      setCommentShowReplies((current) => {
        const notSameAsPrevious = !current.every(
          (val, index) => val === updatedLoadingState[index]
        );
        return notSameAsPrevious ? updatedLoadingState : current;
      });
    }

    prevCommentsRef.current = comments;
    prevSectionIdRef.current = section.id;
  }, [comments, section]);

  if (comments.length === 0) {
    if (!canComment || isLoading) {
      return null; // No need to show a header for nothing at all.
    }
    return (
      <div className='commentlist'>
        <p>
          <FormattedMessage id='noCommentsAvailable' />
        </p>
      </div>
    );
  }
  return (
    <ul className='commentlist'>
      {comments.map((comment, index) => (
        <Comment
          canReply={canReply}
          canVote={canVote}
          canFlag={canFlag}
          data={comment}
          defaultNickname={defaultNickname}
          hearingId={hearingId}
          key={comment.id + Math.random()}
          jumpTo={jumpTo}
          language={language}
          nicknamePlaceholder={nicknamePlaceholder}
          onDeleteComment={onDeleteComment}
          onEditComment={onEditComment}
          onGetSubComments={onGetSubComments}
          onPostReply={onPostReply}
          onPostVote={onPostVote}
          onPostFlag={onPostFlag}
          questions={section.questions}
          section={section}
          user={user}
          showReplies={commentShowReplies[index]}
        />
      ))}
    </ul>
  );
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
  jumpTo: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
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

export default CommentList;
