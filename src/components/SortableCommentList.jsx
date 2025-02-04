/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { get, isEmpty, find } from 'lodash';
import { Waypoint } from 'react-waypoint';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Select } from 'hds-react';

import WrappedCommentList from './Hearing/CommentList';
import LoadSpinner from './LoadSpinner';
import Icon from '../utils/Icon';
import MapQuestionnaire from './plugins/MapQuestionnaire';
import QuestionResults from './QuestionResults';
import CommentForm from './BaseCommentForm';
import { getAuthorDisplayName } from '../utils/user';
import { getSectionCommentingMessage } from '../utils/section';
import getUser from '../selectors/user';

const ORDERING_CRITERIA = {
  CREATED_AT_DESC: '-created_at',
  CREATED_AT_ASC: 'created_at',
  POPULARITY_DESC: '-n_votes',
  POPULARITY_ASC: 'n_votes',
};

const DEFAULT_ORDERING = ORDERING_CRITERIA.CREATED_AT_DESC;

/**
 * SortableCommentListComponent is a component that displays a sortable list of comments.
 *
 * @component
 * @param {boolean} canComment - Indicates if the user can comment.
 * @param {boolean} canFlag - Indicates if the user can flag comments.
 * @param {boolean} canVote - Indicates if the user can vote on comments.
 * @param {boolean} closed - Indicates if the comment section is closed.
 * @param {string} hearingId - The ID of the hearing.
 * @param {object} hearingGeojson - The geojson data associated with the hearing.
 * @param {string} hearingSlug - The slug of the hearing.
 * @param {boolean} displayVisualization - Indicates if the visualization should be displayed.
 * @param {object} intl - The internationalization object.
 * @param {string} language - The language of the component.
 * @param {boolean} published - Indicates if the hearing is published.
 * @param {object} section - The section object.
 * @param {object} sectionComments - The comments for the section.
 * @param {object} user - The user object.
 * @param {Function} onGetSubComments - The function to get sub-comments.
 * @param {Function} onDeleteComment - The function to delete a comment.
 * @param {Function} onEditComment - The function to edit a comment.
 * @param {Function} onPostComment - The function to post a comment.
 * @param {Function} onPostVote - The function to post a vote.
 * @param {Function} onPostFlag - The function to post a flag.
 * @param {Function} fetchComments - The function to fetch comments.
 * @param {Function} fetchAllComments - The function to fetch all comments.
 * @param {Function} fetchMoreComments - The function to fetch more comments.
 * @returns {JSX.Element} The rendered SortableCommentListComponent.
 */
const SortableCommentListComponent = ({
  canComment,
  canFlag,
  canVote,
  closed,
  hearingId,
  hearingGeojson,
  hearingSlug,
  displayVisualization,
  defaultNickname,
  intl,
  language,
  published,
  section,
  sectionComments,
  user,
  onGetSubComments,
  onDeleteComment,
  onEditComment,
  onPostComment: onPostCommentFn,
  onPostVote,
  onPostFlag,
  fetchComments: fetchCommentsFn,
  fetchAllComments,
  fetchMoreComments: fetchMoreCommentsFn,
}) => {
  const answersInitialState = useMemo(
    () =>
      section.questions.map((question) => ({
        question: question.id,
        type: question.type,
        answers: [],
      })),
    [section.questions],
  );

  const [listState, setListState] = useState({
    showLoader: false,
    collapseForm: false,
    shouldAnimate: false,
    answers: answersInitialState,
  });

  /**
   * Fetches comments based on the provided section ID and ordering.
   * If a plugin is involved and displayVisualization is true, it fetches all comments for display.
   * Otherwise, it fetches comments using the fetchCommentsFn function.
   *
   * @param {string} sectionId - The ID of the section.
   * @param {string} ordering - The ordering of the comments.
   * @returns {Promise} - A promise that resolves to the fetched comments.
   */
  const fetchComments = (sectionId, ordering) => {
    // if a plugin is involved, we must fetch all the comments for display, not just a select few
    if (displayVisualization && section.plugin_identifier) {
      return fetchAllComments(hearingSlug, sectionId, ordering);
    }

    return fetchCommentsFn(sectionId, ordering);
  };

  useEffect(() => {
    fetchComments(section.id, DEFAULT_ORDERING);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sectionComments) {
      // eslint-disable-next-line no-unused-vars
      const { isFetching, results } = sectionComments;

      setListState({
        ...listState,
        answers: section.questions.map((question) => ({
          question: question.id,
          type: question.type,
          answers: [],
        })),
        showLoader: isFetching,
        collapseForm: false,
      });

      if (!isFetching && results && results.length === 0 && section.n_comments !== 0) {
        fetchComments(section.id, sectionComments.ordering);

        setListState({ ...listState, collapseForm: true });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, sectionComments, user]);

  /**
   * Fetches more comments for a section.
   */
  const fetchMoreComments = () => {
    const { id: sectionId } = section;
    const { ordering, next } = sectionComments;

    if (next) {
      fetchMoreCommentsFn(sectionId, ordering, next);
    }
  };

  /**
   * Handles the reach bottom event.
   * If there are more section comments to fetch, it calls the fetchMoreComments function after a delay of 1000ms.
   * It also sets the showLoader state to true.
   */
  const handleReachBottom = () => {
    if (sectionComments && sectionComments.count !== sectionComments.results.length) {
      setTimeout(() => fetchMoreComments(), 1000);

      setListState({ ...listState, showLoader: true });
    }
  };

  const onPostComment = async (comment) => {
    const { answers } = listState;

    if (user) {
      setListState({ ...listState, shouldAnimate: true });
    }

    const commentData = { ...comment, answers };

    if (onPostCommentFn) {
      await onPostCommentFn(section.id, commentData);

      setListState({ ...listState, answers: answersInitialState });
    }
  };

  /**
   * Handles posting a reply to a comment.
   *
   * @param {string} sectionId - The ID of the section.
   * @param {object} data - The data of the comment.
   */
  const handlePostReply = (sectionId, data) => onPostCommentFn(sectionId, data);

  /**
   * Handles the change of answers for a specific question.
   *
   * @param {string} questionId - The ID of the question.
   * @param {string} questionType - The type of the question.
   * @param {string} value - The new value of the answer.
   */
  const onChangeAnswers = (questionId, questionType, value) => {
    const { answers } = listState;

    const oldAnswer = find(answers, (answer) => answer.question === questionId);

    if (questionType === 'single-choice') {
      setListState({
        answers: [
          ...listState.answers.filter((answer) => answer.question !== questionId),
          {
            question: questionId,
            type: questionType,
            answers: [value],
          },
        ],
      });
    } else if (questionType === 'multiple-choice' && oldAnswer && oldAnswer.answers.includes(value)) {
      setListState({
        answers: [
          ...listState.answers.filter((answer) => answer.question !== questionId),
          {
            ...oldAnswer,
            answers: oldAnswer.answers.filter((answer) => answer !== value),
          },
        ],
      });
    } else if (questionType === 'multiple-choice' && oldAnswer) {
      setListState({
        answers: [
          ...listState.answers.filter((answer) => answer.question !== questionId),
          {
            ...oldAnswer,
            answers: [...oldAnswer.answers, value],
          },
        ],
      });
    }
  };

  /**
   * Handles the vote for a comment.
   *
   * @param {string} commentId - The ID of the comment.
   * @param {string} sectionId - The ID of the section.
   * @param {boolean} isReply - Indicates if the comment is a reply.
   * @param {string} parentId - The ID of the parent comment.
   * @returns {void}
   */
  const handlePostVote = (commentId, sectionId, isReply, parentId) => {
    setListState({ ...listState, shouldAnimate: false });

    onPostVote(commentId, sectionId, isReply, parentId);
  };

  /**
   * Handles posting a flag for a comment.
   *
   * @param {string} commentId - The ID of the comment.
   * @param {string} sectionId - The ID of the section.
   * @param {boolean} isReply - Indicates if the comment is a reply.
   * @param {string} parentId - The ID of the parent comment (if applicable).
   */
  const handlePostFlag = (commentId, sectionId, isReply, parentId) =>
    onPostFlag(commentId, sectionId, isReply, parentId);

  /**
   * Renders the map visualization component.
   *
   * @returns {JSX.Element} The rendered map visualization component.
   */
  const renderMapVisualization = () => (
    <div className='comments-visualization'>
      <MapQuestionnaire
        data={section.plugin_data}
        pluginPurpose='viewHeatmap'
        comments={sectionComments.results}
        pluginSource={section.plugin_iframe_url}
        pluginInstanceId='map'
      />
      <div className='image-caption'>Kaikkien merkintöjen ja äänien tiheyskartta.</div>
    </div>
  );

  /**
   * Renders the plugin content based on the section's plugin identifier.
   *
   * @returns {JSX.Element|null} The rendered plugin content or null if the plugin is not supported.
   */
  const renderPluginContent = () => {
    const { results: comments } = sectionComments;

    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return null;
    }

    switch (section.plugin_identifier) {
      case 'mapdon-ksv':
        // This is legacy support.
        return (
          <div className='comments-visualization'>
            <MapQuestionnaire
              data={section.plugin_data}
              pluginInstanceId='ksv'
              pluginPurpose='viewComments'
              comments={comments}
            />
            <div className='image-caption'>Kaikki annetut kommentit sekä siirretyt ja lisätyt asemat kartalla.</div>
            <MapQuestionnaire
              data={section.plugin_data}
              pluginInstanceId='ksv'
              pluginPurpose='viewHeatmap'
              comments={comments}
            />
            <div className='image-caption'>Siirrettyjen ja lisättyjen asemien tiheyskartta.</div>
          </div>
        );
      case 'map-questionnaire':
        // Only display visualization if the plugin allows non-fullscreen rendering
        if (!section.plugin_fullscreen) {
          return renderMapVisualization();
        }
        return null;
      default:
        return null; // The plugin does not support result visualization.
    }
  };

  const urlFragmentCommentId = window.location.hash.startsWith('#comment-')
    ? Number(window.location.hash.replace('#comment-', ''))
    : null;

  const showCommentList =
    section && sectionComments && get(sectionComments, 'results') && !isEmpty(sectionComments.results);

  const commentForm =
    published && !closed ? (
      <div className='row'>
        <div className={classnames('comment-form-container', { disabled: !canComment })}>
          <CommentForm
            canComment={canComment}
            hearingId={hearingId}
            onPostComment={onPostComment}
            defaultNickname={defaultNickname}
            nicknamePlaceholder={getAuthorDisplayName(user) || intl.formatMessage({ id: 'anonymous' })}
            collapseForm={listState.collapseForm}
            section={section}
            language={language}
            onChangeAnswers={onChangeAnswers}
            answers={listState.answers}
            closed={closed}
            loggedIn={!isEmpty(user)}
            user={user}
            hearingGeojson={hearingGeojson}
          />
          {!canComment && <FormattedMessage id={getSectionCommentingMessage(section)} />}
        </div>
      </div>
    ) : null;

  const pluginContent = showCommentList && displayVisualization ? renderPluginContent() : null;

  const sortOptions = Object.keys(ORDERING_CRITERIA).map((key) => {
    const message = intl.formatMessage({ id: key });

    return { value: ORDERING_CRITERIA[key], label: message };
  });

  const defaultSortOption = sortOptions.find((option) => option.value === get(sectionComments, 'ordering'));

  return (
    <div>
      {section.commenting !== 'none' && (
        <div className='sortable-comment-list'>
          {closed && section.questions.length >= 1 && (
            <div style={{ padding: '12px', marginBottom: '24px', background: '#ffffff' }}>
              {section.questions.map((question) => (
                <QuestionResults key={question.id} question={question} lang={language} />
              ))}
            </div>
          )}
          {commentForm}
          <div>
            <h2>
              <FormattedMessage id='comments' />
              <div className='commenticon'>
                <span aria-hidden='true'>
                  <Icon name='comment-o' />
                  &nbsp;
                </span>
                {section.n_comments}
              </div>
            </h2>
            {pluginContent}
            {listState.showLoader && (
              <div className='sortable-comment-list__loader'>
                <LoadSpinner />
              </div>
            )}
            {showCommentList && (
              <div className='row'>
                <form className='sort-selector'>
                  <div id='sort-select'>
                    <Select
                      label={<FormattedMessage id='commentOrder' />}
                      options={sortOptions}
                      defaultValue={defaultSortOption}
                      onChange={(selected) => fetchComments(section.id, selected.value)}
                    />
                  </div>
                </form>
              </div>
            )}

            {showCommentList && (
              <div>
                <WrappedCommentList
                  canReply={canComment && published}
                  onPostReply={handlePostReply}
                  onGetSubComments={onGetSubComments}
                  canVote={canVote}
                  canFlag={canFlag}
                  comments={sectionComments.results}
                  defaultNickname={defaultNickname}
                  hearingId={hearingId}
                  intl={intl}
                  isLoading={listState.showLoader}
                  jumpTo={urlFragmentCommentId || (listState.shouldAnimate && sectionComments.jumpTo)}
                  language={language}
                  nicknamePlaceholder={getAuthorDisplayName(user) || intl.formatMessage({ id: 'anonymous' })}
                  onDeleteComment={onDeleteComment}
                  onEditComment={onEditComment}
                  onPostVote={handlePostVote}
                  onPostFlag={handlePostFlag}
                  section={section}
                  totalCount={sectionComments.count}
                  user={user}
                />
                <Waypoint onEnter={handleReachBottom} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SortableCommentListComponent.propTypes = {
  canComment: PropTypes.bool,
  canVote: PropTypes.bool,
  canFlag: PropTypes.bool,
  closed: PropTypes.bool,
  displayVisualization: PropTypes.bool,
  defaultNickname: PropTypes.string,
  fetchAllComments: PropTypes.func,
  fetchComments: PropTypes.func,
  fetchMoreComments: PropTypes.func,
  hearingGeojson: PropTypes.object,
  hearingId: PropTypes.string,
  hearingSlug: PropTypes.string,
  language: PropTypes.string,
  onDeleteComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onGetSubComments: PropTypes.func,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  onPostFlag: PropTypes.func,
  published: PropTypes.bool,
  section: PropTypes.object,
  sectionComments: PropTypes.object,
  user: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = (state, { section: { id: sectionId } }) => ({
  sectionComments: get(state, `sectionComments.${sectionId}`),
  user: getUser(state),
  language: state.language,
});

export default connect(mapStateToProps)(injectIntl(SortableCommentListComponent));
