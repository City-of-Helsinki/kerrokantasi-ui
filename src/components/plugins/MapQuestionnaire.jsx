/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, TextArea } from 'hds-react';
import { useDispatch } from 'react-redux';

import { alert, createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import {
  checkFormErrors,
  hasUserAnsweredAllQuestions,
  isEmptyCommentAllowed,
  hasAnyAnswers,
} from '../../utils/section';
import CommentDisclaimer from '../CommentDisclaimer';
import config from '../../config';
import { addToast } from '../../actions/toast';

/**
 * Renders a MapQuestionnaire component.
 *
 * @component
 * @param {Array} comments - The comments data.
 * @param {Object} data - The data object.
 * @param {Function} onPostComment - The function to post a comment.
 * @param {Function} onPostVote - The function to post a vote.
 * @param {string} pluginInstanceId - The plugin instance ID.
 * @param {string} pluginPurpose - The plugin purpose.
 * @param {string} pluginSource - The plugin source.
 * @returns {JSX.Element} The rendered MapQuestionnaire component.
 */
const MapQuestionnaire = ({
  comments,
  data,
  onPostComment,
  onPostVote,
  pluginInstanceId,
  pluginPurpose,
  pluginSource,
}) => {
  const {
    answers,
    defaultNickname = '',
    comments: commentsData,
    isReply,
    loggedIn,
    nicknamePlaceholder,
    section,
    user,
  } = data;

  /**
   * Determines whether the logged in user is admin or not.
   * The array in users with key adminOrganizations should be of length > 0
   */
  const isUserAdmin = useMemo(
    () => loggedIn && user && Array.isArray(user.adminOrganizations) && user.adminOrganizations.length > 0,
    [loggedIn, user],
  );

  const formInitialSettings = {
    nickname: defaultNickname,
    pinned: false,
    showAlert: true,
    hideName: false,
    organization: isUserAdmin ? user.adminOrganizations[0] : undefined,
    collapsed: true,
    comments: comments || commentsData || [],
    lastUserComment: null,
    lastUserData: null,
    onReceiveMessage: null,
    pluginInstanceId: pluginInstanceId + Math.floor(Math.random() * 10000000),
    submitting: false,
    userDataChanged: false,
  };

  const [comment, setComment] = useState('');
  const [commentImages, setCommentImages] = useState([]);
  const [commentGeoJson, setCommentGeoJson] = useState({
    geojson: {},
    mapCommentText: '',
  });

  const [formSettings, setFormSettings] = useState(formInitialSettings);

  const [formErrors, setFormErrors] = useState({
    imageTooBig: false,
    commentOrAnswerRequiredError: false,
    commentRequiredError: false,
  });

  const resetForm = () => {
    setComment('');
    setCommentImages([]);
    setCommentGeoJson({
      geojson: {},
      mapCommentText: '',
    });
    setFormSettings(formInitialSettings);
    setFormErrors({
      imageTooBig: false,
      commentRequiredError: false,
      commentOrAnswerRequiredError: false,
    });
  };

  const [messageListener, setMessageListener] = useState(null);

  const frameRef = useRef();

  const dispatch = useDispatch();

  /**
   * Retrieves the plugin data from the form data.
   * @returns {Object} The plugin data from the form data.
   */
  const getPluginData = () => formSettings.lastUserData;

  /**
   * Retrieves the last user comment from the form data.
   *
   * @returns {string} The last user comment.
   */
  const getPluginComment = () => formSettings.lastUserComment;

  /**
   * Updates the form data state based on the provided errors.
   *
   * @param {string[]} errors - The array of errors.
   * @returns {void}
   */
  const handleErrorStates = (errors) => {
    setFormErrors({
      commentRequiredError: errors.includes('commentRequiredError'),
      commentOrAnswerRequiredError: errors.includes('commentOrAnswerRequiredError'),
      imageTooBig: errors.includes('imageTooBig'),
    });
  };

  /**
   * Submits a comment.
   *
   * @returns {void}
   */
  const submitComment = () => {
    if (config.maintenanceDisableComments) {
      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.info, 'maintenanceNotificationText')));

      return;
    }

    const pluginComment = getPluginComment();
    let pluginData = getPluginData();

    const { nickname, pinned, organization } = formSettings;
    const { geojson, mapCommentText } = commentGeoJson;
    const { imageTooBig } = formErrors;

    const commentText = comment;
    const images = commentImages;

    const submitData = {
      nickname: nickname === '' ? nicknamePlaceholder : nickname,
      commentText: commentText === null ? '' : commentText,
      geojson,
      images,
      pinned,
      mapCommentText,
      label: null,
      organization,
    };

    // plugin comment will override comment fields, if provided
    if (pluginComment) {
      submitData.commentText = pluginComment.content || submitData.commentText;
      submitData.nickname = pluginComment.author_name || submitData.nickname;
      pluginData = pluginComment.plugin_data || pluginData;
      submitData.label = pluginComment.label || submitData.label;
      submitData.images = pluginComment.image ? [pluginComment.image] : submitData.images;
      submitData.geojson = pluginComment.geojson || submitData.geojson;
      submitData.pinned = pluginComment.pinned || null;
      submitData.mapCommentText = pluginComment.mapCommentText || submitData.commentText;
    } else if (pluginData && typeof pluginData !== 'string') {
      // this is for old-fashioned plugins with only data
      pluginData = JSON.stringify(pluginData);
    }

    // validate form errors here before posting the comment
    const userHasAnsweredAllQuestions = loggedIn && hasUserAnsweredAllQuestions(user, section);

    const errors = checkFormErrors(
      imageTooBig,
      submitData.commentText,
      section,
      answers,
      isReply,
      userHasAnsweredAllQuestions,
    );

    if (errors.length > 0) {
      handleErrorStates(errors);
      return;
    }

    // make sure empty comments are not added when not intended
    if (isEmptyCommentAllowed(section, hasAnyAnswers(answers)) && !submitData.commentText.trim()) {
      submitData.setCommentText = config.emptyCommentString;
    }

    onPostComment({
      text: submitData.commentText,
      authorName: submitData.nickname,
      pluginData,
      geojson: submitData.geojson,
      label: submitData.label,
      images: submitData.images,
      pinned: submitData.pinned,
      mapCommentText: submitData.mapCommentText,
      organization: submitData.organization ?? undefined,
    });

    resetForm();
  };

  /**
   * Handles the received message from the event.
   *
   * @param {Event} event - The event object.
   */
  const onReceiveMessage = (event) => {
    if (!event) {
      return;
    }

    const payload = event.data;

    if (typeof payload === 'string') {
      return;
    }

    if (payload.instanceId !== formSettings.pluginInstanceId) {
      return;
    }

    // override user messages if in visualization mode
    if (pluginPurpose && pluginPurpose !== 'postComments') {
      return;
    }

    if (payload.message === 'userData') {
      // whenever user data is sent by the plugin, post it no questions asked
      setFormSettings((prevState) => ({ ...prevState, lastUserComment: payload.comment, submitting: false }));

      if (formSettings.lastUserComment) {
        submitComment();
      } else {
        alert('Et muuttanut mitään kartassa.');
      }
    }

    if (payload.message === 'userDataChanged') {
      setFormSettings((prevState) => ({ ...prevState, userDataChanged: true }));
    }

    if (onPostVote && payload.message === 'userVote') {
      onPostVote(payload.commentId);
    }
  };

  /**
   * Sends a message to the plugin frame.
   *
   * @param {any} message - The message to be sent.
   */
  const sendMessageToPluginFrame = (message) => frameRef.current.contentWindow.postMessage(message, '*');

  useEffect(() => {
    if (!messageListener) {
      setMessageListener(onReceiveMessage);

      if (typeof window !== 'undefined') window.addEventListener('message', messageListener, false);
    }

    frameRef.current.addEventListener(
      'load',
      () => {
        sendMessageToPluginFrame({
          message: 'mapData',
          data,
          pluginPurpose,
          comments: formSettings.comments,
          instanceId: formSettings.pluginInstanceId,
        });
      },
      false,
    );

    return () => {
      if (messageListener) {
        if (typeof window !== 'undefined') window.removeEventListener('message', messageListener, false);
        setMessageListener(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (comments) {
      setFormSettings((prevState) => ({ ...prevState, comments }));
    }

    // do not redraw plugin contents if user has interacted with the plugin!
    if (!formSettings.userDataChanged) {
      sendMessageToPluginFrame({
        message: 'mapData',
        data,
        pluginPurpose,
        comments: formSettings.comments,
        instanceId: formSettings.pluginInstanceId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, formSettings.userDataChanged]);

  /**
   * Handles the change event of the text input.
   * @param {Event} event - The change event.
   * @returns {void}
   */
  const handleTextChange = (event) => {
    setComment(event.target.value);
    setFormErrors((prevState) => ({ ...prevState, commentRequiredError: false, commentOrAnswerRequiredError: false }));
  };

  /**
   * Function to get data and submit comment.
   */
  const getDataAndSubmitComment = () => {
    setFormSettings((prevState) => ({ ...prevState, submitting: true }));

    sendMessageToPluginFrame({
      message: 'getUserData',
      instanceId: formSettings.pluginInstanceId,
    });
  };

  /**
   * Returns the template JSX based on the provided pluginId.
   *
   * @param {string} pluginId - The ID of the plugin.
   * @returns {JSX.Element} - The template JSX.
   */
  const getTemplate = (pluginId) => {
    switch (pluginId) {
      case 'hkr':
        return (
          <div className='plugin-comment-form mapdon-hkr-plugin-comment-form'>
            <form>
              <iframe
                src='/assets/mapdon-hkr/plugin-inlined.html'
                className='plugin-frame mapdon-hkr-plugin-frame'
                ref={frameRef}
              />
              <br />
              <TextArea
                id='comment-suggestion'
                placeholder='Kommentoi ehdotustasi tässä.'
                onChange={handleTextChange}
                style={{ marginBottom: 'var(--spacing-s)' }}
              />
              <p>
                <Button
                  className='kerrokantasi-btn'
                  onClick={getDataAndSubmitComment}
                  disabled={formSettings.submitting}
                >
                  Lähetä ehdotus
                </Button>
              </p>
              <CommentDisclaimer />
            </form>
          </div>
        );

      case 'ksv':
        return (
          <div className='plugin-comment-form mapdon-ksv-plugin-comment-form'>
            <form>
              <iframe
                src='/assets/mapdon-ksv/plugin-inline.html'
                className='plugin-frame mapdon-ksv-plugin-frame'
                ref={frameRef}
              />
              {pluginPurpose === 'postComments' ? (
                <div>
                  <br />
                  <TextArea
                    label={<FormattedMessage id='writeComment' />}
                    placeholder='Kommentoi ehdotustasi tässä.'
                    value={comment}
                    onChange={handleTextChange}
                    style={{ marginBottom: 'var(--spacing-s)' }}
                  />
                  <p>
                    <Button
                      className='kerrokantasi-btn'
                      onClick={getDataAndSubmitComment}
                      disabled={formSettings.submitting || (!comment && !formSettings.userDataChanged)}
                    >
                      Lähetä ehdotus
                    </Button>
                  </p>
                  <CommentDisclaimer />
                </div>
              ) : null}
            </form>
          </div>
        );

      default:
        return (
          <div className='plugin-comment-form map-plugin-comment-form'>
            <form>
              <iframe src={pluginSource} className='plugin-frame map-plugin-frame' ref={frameRef} />
            </form>
          </div>
        );
    }
  };

  return getTemplate(pluginInstanceId);
};

MapQuestionnaire.propTypes = {
  comments: PropTypes.array,
  data: PropTypes.object,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  pluginInstanceId: PropTypes.string,
  pluginPurpose: PropTypes.string,
  pluginSource: PropTypes.string,
};

export default MapQuestionnaire;
