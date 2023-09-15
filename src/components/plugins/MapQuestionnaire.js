/* eslint-disable no-case-declarations */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { alert, localizedNotifyError } from '../../utils/notify';
import {
  checkFormErrors,
  hasUserAnsweredAllQuestions,
  isEmptyCommentAllowed,
  hasAnyAnswers,
} from '../../utils/section';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { BaseCommentFormDefaulProps } from '../BaseCommentForm';
import CommentDisclaimer from "../CommentDisclaimer";
import config from '../../config';

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
    defaultNickname,
    comments: commentsData,
    isReply,
    loggedIn,
    nicknamePlaceholder,
    section,
    user,
  } = data;

  const [formData, setFormData] = useState({
    collapsed: true,
    commentOrAnswerRequiredError: false,
    commentRequiredError: false,
    comments: comments || commentsData || [],
    commentText: '',
    geojson: {},
    hideName: false,
    images: [],
    imageTooBig: false,
    lastUserComment: null,
    lastUserData: null,
    mapCommentText: '',
    nickname: defaultNickname || '',
    onReceiveMessage: null,
    pinned: false,
    pluginInstanceId: pluginInstanceId + Math.floor(Math.random() * 10000000),
    submitting: false,
    showAlert: true,
    userDataChanged: false,
  });

  const [messageListener, setMessageListener] = useState(null);

  const frameRef = useRef();

  const getPluginData = () => formData.lastUserData;
  const getPluginComment = () => formData.lastUserComment;

  const handleErrorStates = (errors) =>
    setFormData((prevState) => ({
      ...prevState,
      commentRequiredError: errors.includes('commentRequiredError'),
      commentOrAnswerRequiredError: errors.includes(
        'commentOrAnswerRequiredError'
      ),
      imageTooBig: errors.includes('imageTooBig'),
    }));

  const submitComment = () => {
    if (config.maintenanceDisableComments) {
      localizedNotifyError('maintenanceNotificationText');

      return;
    }

    const pluginComment = getPluginComment();
    let pluginData = getPluginData();

    const {
      nickname,
      commentText,
      geojson,
      images,
      pinned,
      mapCommentText,
      imageTooBig,
    } = formData;

    const submitData = {
      nickname: nickname === '' ? nicknamePlaceholder : nickname,
      commentText: commentText === null ? '' : commentText,
      geojson,
      images,
      pinned,
      mapCommentText,
      label: null
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
      submitData.commentText = pluginComment.mapCommentText || submitData.commentText;
    } else if (pluginData && typeof pluginData !== 'string') {
      // this is for old-fashioned plugins with only data
      pluginData = JSON.stringify(pluginData);
    }

    // validate form errors here before posting the comment
    const userHasAnsweredAllQuestions =
      loggedIn && hasUserAnsweredAllQuestions(user, section);

    const errors = checkFormErrors(
      imageTooBig,
      submitData.commentText,
      section,
      answers,
      isReply,
      userHasAnsweredAllQuestions
    );

    if (errors.length > 0) {
      handleErrorStates(errors);
      return;
    }

    // make sure empty comments are not added when not intended
    if (isEmptyCommentAllowed(section, hasAnyAnswers(answers))) {
      if (!submitData.commentText.trim()) {
        submitData.setCommentText = config.emptyCommentString;
      }
    }

    onPostComment(
      submitData.commentText,
      submitData.nickname,
      pluginData,
      submitData.geojson,
      submitData.label,
      submitData.images,
      submitData.pinned,
      submitData.commentText,
    );

    setFormData((prevState) => ({
      ...prevState,
      collapsed: false,
      commentText: '',
      nickname: defaultNickname || '',
      imageTooBig: false,
      images: [],
      pinned: false,
      showAlert: true,
      hideName: false,
      geojson: {},
      mapCommentText: '',
      commentRequiredError: false,
      commentOrAnswerRequiredError: false,
    }));
  };

  const onReceiveMessage = (event) => {
    const payload = event.data;

    if (typeof payload === 'string') {
      return;
    }

    if (payload.instanceId !== formData.pluginInstanceId) {
      return;
    }

    // override user messages if in visualization mode
    if (pluginPurpose && pluginPurpose !== 'postComments') {
      return;
    }

    if (payload.message === "userData") {
      // whenever user data is sent by the plugin, post it no questions asked
      setFormData((prevState) => ({ ...prevState, lastUserComment: payload.comment, submitting: false }));

      if (formData.lastUserComment) {
        submitComment();
      } else {
        alert("Et muuttanut mitään kartassa.");
      }
    }

    if (payload.message === "userDataChanged") {
      setFormData((prevState) => ({ ...prevState, userDataChanged: true }));
    }

    if (onPostVote && payload.message === "userVote") {
      onPostVote(payload.commentId);
    }
  };

  const sendMessageToPluginFrame = (message) => frameRef.current.contentWindow.postMessage(message, "*");

  useEffect(() => {
    if (!messageListener) {
      setMessageListener(onReceiveMessage);

      if (typeof window !== 'undefined') window.addEventListener("message", messageListener, false);
    }

    frameRef.current.addEventListener("load", () => {
      sendMessageToPluginFrame({
        message: "mapData",
        data,
        pluginPurpose,
        comments: formData.comments,
        instanceId: formData.pluginInstanceId
      });
    }, false);

    return () => {
      if (messageListener) {
        if (typeof window !== 'undefined') window.removeEventListener("message", messageListener, false);
        setMessageListener(null);
      }
    };
  }, []);


  useEffect(() => {
    if (comments) {
      setFormData((prevState) => ({ ...prevState, comments }));
    }

    // do not redraw plugin contents if user has interacted with the plugin!
    if (!formData.userDataChanged) {
      sendMessageToPluginFrame({
        message: "mapData",
        data,
        pluginPurpose,
        comments: formData.comments,
        instanceId: formData.pluginInstanceId
      });
    }
  }, [comments, formData.userDataChanged]);

  const handleTextChange = (event) =>
    setFormData({
      ...formData,
      commentText: event.target.value,
      commentRequiredError: false,
      commentOrAnswerRequiredError: false,
    });

  const getDataAndSubmitComment = () => {
    setFormData((prevState) => ({ ...prevState, submitting: true }));

    sendMessageToPluginFrame({
      message: "getUserData",
      instanceId: formData.pluginInstanceId
    });
  };

  const getTemplate = (pluginId) => {
    switch (pluginId) {
      case "hkr":

        return (
          <div className="plugin-comment-form mapdon-hkr-plugin-comment-form">
            <form>
              <iframe
                src="/assets/mapdon-hkr/plugin-inlined.html"
                className="plugin-frame mapdon-hkr-plugin-frame"
                ref={frameRef}
              />
              <br />
              <FormGroup>
                <FormControl
                  componentClass="textarea"
                  onChange={handleTextChange}
                  placeholder="Kommentoi ehdotustasi tässä."
                />
              </FormGroup>
              <p>
                <Button bsStyle="primary" onClick={getDataAndSubmitComment} disabled={formData.submitting}>
                  Lähetä ehdotus
                </Button>
              </p>
              <CommentDisclaimer />
            </form>
          </div>);

      case "ksv":
        const buttonDisabled = formData.submitting || (!formData.commentText && !formData.userDataChanged);

        const commentBox = (
          <div>
            <br />
            <FormGroup>
              <h3><FormattedMessage id="writeComment" /></h3>
              <FormControl
                componentClass="textarea"
                onChange={handleTextChange}
                value={formData.commentText}
                placeholder="Kommentoi ehdotustasi tässä."
              />
            </FormGroup>
            <p>
              <Button bsStyle="primary" onClick={getDataAndSubmitComment} disabled={buttonDisabled}>
                Lähetä ehdotus
              </Button>
            </p>
            <CommentDisclaimer />
          </div>
        );

        return (
          <div className="plugin-comment-form mapdon-ksv-plugin-comment-form">
            <form>
              <iframe
                src="/assets/mapdon-ksv/plugin-inline.html"
                className="plugin-frame mapdon-ksv-plugin-frame"
                ref="frame"
              />
              {pluginPurpose === 'postComments' ? commentBox : null}
            </form>
          </div>
        );

      default:
        return (
          <div className="plugin-comment-form map-plugin-comment-form">
            <form>
              <iframe
                src={pluginSource}
                className="plugin-frame map-plugin-frame"
                ref={frameRef}
              />
            </form>
          </div>);
    }
  };

  return getTemplate(pluginInstanceId);
};

MapQuestionnaire.propTypes = {
  comments: PropTypes.array,
  data: PropTypes.string,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  pluginInstanceId: PropTypes.string,
  pluginPurpose: PropTypes.string,
  pluginSource: PropTypes.string,
};

MapQuestionnaire.defaultProps = BaseCommentFormDefaulProps;

export default injectIntl(MapQuestionnaire);
