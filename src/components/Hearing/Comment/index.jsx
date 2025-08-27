/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable sonarjs/no-uniq-key */
/* eslint-disable sonarjs/todo-tag */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, useIntl } from 'react-intl';
import { Button, TextArea, Tooltip as HDSTooltip, IconSpeechbubbleText } from 'hds-react';
import nl2br from 'react-nl2br';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import CommentForm from '../../BaseCommentForm';
import ShowMore from './ShowMore';
import Answer from './Answer';
import QuestionForm from '../../QuestionForm';
import Icon from '../../../utils/Icon';
import {
  createLocalizedNotificationPayload,
  createNotificationPayload,
  NOTIFICATION_TYPES,
} from '../../../utils/notify';
import getAttr from '../../../utils/getAttr';
import HearingMap from '../HearingMap';
import getMessage from '../../../utils/getMessage';
import FormatRelativeTime from '../../../utils/FormatRelativeTime';
import { addToast } from '../../../actions/toast';
import updateAnswers from '../../../utils/comments';
import { isAdmin } from '../../../utils/user';

const Comment = (props) => {
  const dispatch = useDispatch();
  const commentRef = useRef();
  const { data, canReply, user } = props;
  const canEdit = data.can_edit;
  const canDelete = data.can_delete;
  let commentEditor;
  const intl = useIntl();
  const adminUser = isAdmin(user);

  const [state, setState] = useState({
    editorOpen: false,
    isReplyEditorOpen: false,
    shouldJumpTo: props.jumpTo === props.data.id,
    scrollComplete: false,
    shouldAnimate: false,
    pinned: props.data.pinned,
    answers: props.data.answers || [],
    displayMap: false,
    showReplies: props.showReplies,
  });

  const { editorOpen, isReplyEditorOpen } = state;

  const handleSubmit = (event) => {
    event.preventDefault();
    const { section, id } = data;
    const commentData = {};

    forEach(data, (value, key) => {
      if (['content', 'images'].indexOf(key) === -1) {
        commentData[key] = value;
      }
    });
    commentData.content = commentEditor.value;
    if (props.data.can_edit && adminUser) {
      commentData.pinned = state.pinned;
    }
    commentData.answers = state.answers;
    props.onEditComment(section, id, commentData);
    setState({ editorOpen: false });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    const { section, id, answers } = data;

    // userdata is updated if the comment contained answers
    props.onDeleteComment(section, id, answers.length > 0);
  };

  const onVote = () => {
    if (props.canVote) {
      // If user has already voted for this comment, block the user from voting again
      const votedComments = JSON.parse(localStorage.getItem('votedComments')) || [];
      if (votedComments.includes(data.id)) {
        dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'alreadyVoted')));
        return;
      }
      props.onPostVote(data.id, data.section, props.isReply, props.parentComponentId);
    } else {
      // TODO: Add translations
      dispatch(
        addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Kirjaudu sisään äänestääksesi kommenttia.')),
      );
    }
  };

  const canFlagComments = () => user && props.canFlag;

  const onFlag = () => {
    if (canFlagComments()) {
      props.onPostFlag(data.id, data.section, props.isReply, props.parentComponentId);
    } else {
      // TODO: Add translations
      dispatch(
        addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Kirjaudu sisään liputtaaksesi kommentin.')),
      );
    }
  };

  const isCommentByAdmin = () => data.organization;

  const onCopyURL = () => {
    // Build absolute URL for comment
    const commentUrl = `${window.location.origin}${window.location.pathname}#comment-${props.data.id}`;
    navigator.clipboard.writeText(commentUrl);
    // TODO: Add translations
    dispatch(
      addToast(createNotificationPayload(NOTIFICATION_TYPES.info, 'Linkki kommenttiin on kopioitu leikepöydällesi.')),
    );
  };

  /**
   * Open reply editor
   */
  const handleToggleReplyEditor = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    setState((prevState) => ({
      isReplyEditorOpen: !prevState.isReplyEditorOpen,
    }));
  };

  /**
   * Call the parent component to retrieve list of sub comments for current comment.
   */
  const getReplies = () => {
    const { section } = props;
    props.onGetSubComments(data.id, section.id);
  };

  /**
   * Toggle whether to display replies or not.
   */
  const toggleReplies = () => {
    setState((prevState) => ({ showReplies: !prevState.showReplies }));
  };
  const getStrigifiedAnswer = (answer) => {
    const { questions } = props;
    const question = find(questions, (que) => que.id === answer.question);
    let selectedOption = {};
    return {
      question: question ? getAttr(question.text, props.intl.locale) : '',
      answers: answer.answers.map((ans) => {
        if (question) selectedOption = find(question.options, (option) => option.id === ans);
        return question ? getAttr(selectedOption.text, props.intl.locale) : '';
      }),
    };
  };

  /**
   * User moment to convert current timestamp to desired format.
   * @returns {String}
   */
  const parseTimestamp = (timestamp) => moment(timestamp).format('DD.MM.YYYY HH:mm');

  /**
   * Handle posting of a reply
   */
  const handlePostReply = (comment) => {
    const { section } = props;

    let commentData = { ...comment };

    if (props.onPostReply && props.onPostReply instanceof Function) {
      if (props.isReply && props.parentComponentId) {
        commentData = { ...commentData, comment: props.parentComponentId };
      } else {
        commentData = { ...commentData, comment: props.data.id };
      }

      props.onPostReply(section.id, { ...commentData });
    }
  };

  /**
   * Toggle the pinning of comment
   */
  const handleTogglePin = () => {
    setState((prevState) => ({
      pinned: !prevState.pinned,
    }));
  };

  /**
   * Once an answer is posted, it can be changed.
   * @param {Number} question - number of corresponding question.
   * @param {String} questionType - example "single-question" "multiple-choice"
   * @param {Number} answer - id of the answer selected by the user.
   */
  const handleAnswerChange = (question, questionType, answer) => {
    const updatedAnswer = updateAnswers(state.answers, question, questionType, answer);
    setState({ answers: updatedAnswer });
  };

  /**
   * When a comment is pinned, a small black box is displayed on top right corner.
   * @returns {JS<Component>}
   */
  const renderPinnedHeader = () => (
    <div className='hearing-comment-pinned-container'>
      <FormattedMessage id='pinnedComment' />
    </div>
  );

  /**
   * Renders the header area for the comment
   * @returns {Component}
   */
  const renderCommentHeader = () => (
    <div className='hearing-comment-header clearfix'>
      {props.data.pinned && renderPinnedHeader()}
      <div className='hearing-comment-publisher'>
        <span className='hearing-comment-user'>
          {data.is_registered ? (
            <span
              className={classnames({
                'hearing-comment-user-registered': !adminUser,
                'hearing-comment-user-organization': adminUser,
              })}
            >
              <Icon name='user' aria-hidden='true' />
              &nbsp;
              {adminUser ? data.organization : <FormattedMessage id='registered' />}
              :&nbsp;
            </span>
          ) : null}
          {data.author_name || <FormattedMessage id='anonymous' />}
        </span>
        <div className='hearing-comment-date-wrapper'>
          <span className='hearing-comment-date'>
            <FormatRelativeTime
              messagePrefix=''
              timeVal={data.created_at}
              formatTime={intl.formatTime}
              formatDate={intl.formatDate}
            />
          </span>
          <HDSTooltip className='hearing-comment-date-tooltip' placement='top'>
            {parseTimestamp(data.created_at)}
          </HDSTooltip>
        </div>
      </div>
      {canFlagComments() && (
        <Button className='hearing-comment-vote-link' onClick={onCopyURL}>
          <Icon name='link' aria-hidden='true' />
        </Button>
      )}
      {canFlagComments() && !data.deleted && (
        <Button data-testid='flag-comment' className='hearing-comment-vote-link' onClick={onFlag}>
          <Icon
            name={classnames({
              'flag-o': !data.flagged,
              flag: data.flagged,
            })}
            aria-hidden='true'
          />
        </Button>
      )}
    </div>
  );

  /**
   * Renders answers for a comment.
   * @returns {JSX<Component>}
   */
  const renderCommentAnswers = () =>
    props.data.answers.map((answer) => <Answer key={answer.question} answer={getStrigifiedAnswer(answer)} />);

  /**
   * When an admin user is logged in and editing their comment.
   * Allow the user to pin and unpin a comment.
   */
  const renderPinUnpinButton = () => (
    <div className='hearing-comment__pin'>
      <Button
        className={classnames([
          'hearing-comment__pin__icon',
          {
            'hearing-comment__pin__pin-comment': !state.pinned,
            'hearing-comment__pin__unpin-comment': state.pinned,
          },
        ])}
        onClick={handleTogglePin}
      />
    </div>
  );

  /**
   * For each answer answered, a user may edit the answer.
   */
  const renderQuestionsForAnswer = (answer) => {
    const correspondingQuestion = props.section.questions.find((question) => question.id === answer.question);
    return (
      <QuestionForm
        question={correspondingQuestion}
        lang={props.language}
        answers={answer}
        key={`$answer-for-question-${answer.question}`}
        loggedIn={!isEmpty(user)}
        onChange={handleAnswerChange}
        canAnswer={props.canReply}
      />
    );
  };

  const toggleEditor = (event) => {
    event.preventDefault();

    setState({ editorOpen: !state.editorOpen });
  };

  /**
   * When state is set to true for editor open. Return the form.
   * When editing, answers may be edited as well.
   * @returns {Component}
   */
  const renderEditorForm = () => (
    <>
      {adminUser && props.data.can_edit && !props.isReply && renderPinUnpinButton()}
      <form data-testid='editorForm' className='hearing-comment__edit-form' onSubmit={(event) => handleSubmit(event)}>
        <div id='formControlsTextarea'>
          {state.answers && state.answers.length > 0
            ? state.answers.map((answer) => renderQuestionsForAnswer(answer))
            : null}
          <TextArea
            id='edit-comment'
            defaultValue={props.data.content}
            placeholder='textarea'
            ref={(input) => {
              commentEditor = input;
            }}
            style={{ marginBottom: 'var(--spacing-s)' }}
          />
        </div>
        <Button className='kerrokantasi-btn black' type='submit'>
          <FormattedMessage id='save' />
        </Button>
        <Button className='kerrokantasi-btn' onClick={toggleEditor}>
          <FormattedMessage id='cancel' />
        </Button>
      </form>
    </>
  );

  /**
   * If a user can edit their comment(s) render hyperlinks
   * @returns {Component|null}
   */
  const renderEditLinks = () => (
    <div className='hearing-comment__edit-links'>
      <Button onClick={(event) => toggleEditor(event)} variant='supplementary' size='small'>
        <FormattedMessage id='edit' />
      </Button>
      {canDelete && (
        <Button onClick={(event) => handleDelete(event)} variant='supplementary' size='small'>
          <FormattedMessage id='delete' />
        </Button>
      )}
    </div>
  );

  /**
   * If a thread can be replied to, render reply links
   */
  const renderReplyLinks = () => (
    <Button
      variant='supplementary'
      iconLeft={<IconSpeechbubbleText />}
      data-testid='replyLink'
      onClick={handleToggleReplyEditor}
    >
      <FormattedMessage id='reply' />
    </Button>
  );

  /**
   * When a comment is being replied to.
   * @returns {Component<Form>}
   */
  const renderReplyForm = () => (
    <CommentForm
      answers={state.answers}
      canComment={props.canReply}
      closed={false}
      defaultNickname={props.defaultNickname}
      hearingId={props.hearingId}
      isReply
      language={props.language}
      loggedIn={!isEmpty(user)}
      nicknamePlaceholder={props.nicknamePlaceholder}
      onChangeAnswers={handleAnswerChange}
      onOverrideCollapse={handleToggleReplyEditor}
      onPostComment={handlePostReply}
      overrideCollapse
      section={props.section}
      user={user}
      hearingGeojson={props.data.geojson}
    />
  );

  /**
   * Returns Button that either toggles the visibility of the replies or calls getReplies to start fetching them.
   *
   * If replies exist -> toggles visibility of the replies, otherwise calls getReplies to start fetching them.
   * @returns {JSX.Element|null}
   */
  const renderViewReplies = () => {
    const subCommentsLoaded = Array.isArray(data.comments) && data.comments.length && data.subComments;
    if (Array.isArray(data.comments) && data.comments.length) {
      return (
        <ShowMore
          numberOfComments={data.comments.length}
          onClickShowMore={subCommentsLoaded ? toggleReplies : getReplies}
          isLoadingSubComment={data.loadingSubComments}
          open={state.showReplies}
        />
      );
    }
    return null;
  };

  /**
   * Renders the sub-comments. Visibility is determined by state.showReplies.
   * Returns a Comment component for each value in data.subComments.
   * @returns {JSX.Element}
   */
  const renderSubComments = () => {
    const { showReplies } = state;
    return (
      <ul className={classnames('sub-comments', { 'list-hidden': !showReplies })}>
        {data.subComments.map((subComment) => (
          <Comment
            {...props}
            parentComponentId={data.id}
            data={subComment}
            key={`${subComment.id}${Math.random()}`}
            isReply
          />
        ))}
      </ul>
    );
  };

  const renderCommentText = () => {
    if (!data.deleted && !data.edited) {
      return <p>{nl2br(data.content)}</p>;
    }
    if (!data.deleted && data.edited) {
      const modifiedMessageId = data.moderated ? 'sectionCommentModeratedMessage' : 'sectionCommentEditedMessage';
      return (
        <div>
          <p>
            {nl2br(data.content)}
            <br />
            <span className='hearing-comment-edited-notification'>
              (<FormattedMessage id={modifiedMessageId} />)
            </span>
          </p>
        </div>
      );
    }
    if (data.deleted_by_type === 'self') {
      return <FormattedMessage id='sectionCommentSelfDeletedMessage' />;
    }

    if (data.deleted_by_type === 'moderator') {
      return (
        <p>
          <FormattedMessage
            id='sectionCommentDeletedMessage'
            values={{ date: data.deleted_at ? moment(new Date(data.deleted_at)).format(' DD.MM.YYYY HH:mm') : '' }}
          />
        </p>
      );
    }
    return <FormattedMessage id='sectionCommentGenericDeletedMessage' />;
  };

  const toggleMap = () => {
    setState((prevState) => ({ displayMap: !prevState.displayMap }));
  };

  useEffect(() => {
    if (state.shouldJumpTo && commentRef?.current && !state.scrollComplete) {
      // Jump to this comment
      commentRef.current.scrollIntoView({
        behaviour: 'smooth',
        block: 'nearest',
      });
      setState({
        scrollComplete: true,
        shouldAnimate: true,
      });
    } else if (
      // Jump to child sub-comment
      props.jumpTo &&
      props.data.comments?.includes(props.jumpTo) &&
      !props.data.loadingSubComments &&
      ((Array.isArray(props.data.subComments) && props.data.subComments.length === 0) ||
        props.data.subComments === undefined)
    ) {
      getReplies();
    } else if (state.showReplies && !props.jumpTo) {
      // focus is set to the toggle element when mounting with existing/fetched replies.
      const toggleContainer = document
        .getElementById(`comment-${props.data.id}`)
        .querySelector('span.hearing-comment__show-more__wrapper');
      if (toggleContainer) {
        // finds the first anchor element and sets focus on it.
        toggleContainer.querySelector('a').focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentRef]);

  if (!data.content) {
    return null;
  }

  return (
    <li
      className={classnames([
        'hearing-comment',
        {
          'comment-reply': props.isReply,
          'hearing-comment__has-replys':
            data.subComments && Array.isArray(data.subComments) && data.subComments.length > 0,
          'comment-animate': state.shouldAnimate,
          'hearing-comment__admin': isCommentByAdmin(),
          'hearing-comment__flagged': canFlagComments() && data.flagged,
          'hearing-comment__is-pinned': props.data.pinned,
        },
      ])}
      ref={commentRef}
      id={`comment-${data.id}`}
    >
      <div className='hearing-comment__comment-wrapper'>
        {renderCommentHeader()}
        {!props.isReply && renderCommentAnswers()}
        <div className={classnames('hearing-comment-body', { 'hearing-comment-body-disabled': data.deleted })}>
          {renderCommentText()}
        </div>
        <div className='hearing-comment__images'>
          {data.images
            ? data.images.map((image) => (
                <a className='hearing-comment-images-image' key={image.url} href={image.url}>
                  <img
                    alt={getMessage('commentImageAlt')}
                    src={image.url}
                    width={image.width < 100 ? image.width : 100}
                    height={image.height < 100 ? image.height : 100}
                  />
                </a>
              ))
            : null}
        </div>
        {data.geojson && (
          <div className='hearing-comment__map'>
            <Button
              onClick={toggleMap}
              className='hearing-comment__map-toggle'
              variant='supplementary'
              aria-expanded={state.displayMap}
            >
              <FormattedMessage id='commentShowMap'>{(text) => text}</FormattedMessage>
            </Button>
            {state.displayMap && data.geojson && (
              <div data-testid='hearing-comment-map-container' className='hearing-comment__map-container'>
                {data.geojson && <HearingMap hearing={{ geojson: data.geojson }} mapSettings={{ dragging: false }} />}
              </div>
            )}
          </div>
        )}
        {canEdit && !data.deleted && renderEditLinks()}
        <div className='hearing-comment__actions-bar'>
          <div className='hearing-comment__reply-link'>{!isReplyEditorOpen && canReply && renderReplyLinks()}</div>
          <div className='hearing-comment-votes'>
            {!data.deleted && (
              <Button className='btn-sm hearing-comment-vote-link' onClick={onVote}>
                <Icon name='thumbs-o-up' aria-hidden='true' /> {data.n_votes}
                <span className='sr-only'>
                  <FormattedMessage id='voteButtonLikes' />. <FormattedMessage id='voteButtonText' />
                </span>
              </Button>
            )}
          </div>
        </div>
        {editorOpen && renderEditorForm()}
        {isReplyEditorOpen && renderReplyForm()}
        {renderViewReplies()}
      </div>
      {Array.isArray(data.subComments) && data.subComments.length > 0 && renderSubComments()}
    </li>
  );
};

Comment.propTypes = {
  canReply: PropTypes.bool,
  canVote: PropTypes.bool,
  canFlag: PropTypes.bool,
  data: PropTypes.object,
  defaultNickname: PropTypes.string,
  hearingId: PropTypes.string,
  intl: PropTypes.object,
  isReply: PropTypes.bool,
  jumpTo: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  language: PropTypes.string,
  nicknamePlaceholder: PropTypes.string,
  onDeleteComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onGetSubComments: PropTypes.func,
  onPostReply: PropTypes.func,
  onPostVote: PropTypes.func,
  onPostFlag: PropTypes.func,
  parentComponentId: PropTypes.number,
  questions: PropTypes.array,
  section: PropTypes.object,
  user: PropTypes.object,
  showReplies: PropTypes.bool,
};

Comment.defaultProps = {
  isReply: false,
};

export default injectIntl(Comment);
