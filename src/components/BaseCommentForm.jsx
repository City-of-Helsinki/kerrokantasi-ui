/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Button, Checkbox, FormControl, FormGroup, ControlLabel, Alert } from 'react-bootstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { v1 as uuid } from 'uuid';
import { get, includes } from 'lodash';
import { Polygon, GeoJSON, Polyline, Circle } from 'react-leaflet';
import urls from '@city-assets/urls.json';
import localization from '@city-i18n/localization.json';
import Leaflet, { LatLng } from 'leaflet';

import Icon from '../utils/Icon';
import { getImageAsBase64Promise } from '../utils/hearing';
import CommentDisclaimer from './CommentDisclaimer';
import QuestionResults from './QuestionResults';
import QuestionForm from './QuestionForm';
import { localizedNotifyError } from '../utils/notify';
import {
  checkFormErrors,
  getFirstUnansweredQuestion,
  getSectionCommentingErrorMessage,
  hasAnyAnswers,
  hasAnyQuestions,
  hasUserAnsweredAllQuestions,
  isCommentRequired,
  isEmptyCommentAllowed,
  isSectionCommentingMapEnabled,
} from '../utils/section';
import leafletMarkerIconUrl from '../../assets/images/leaflet/marker-icon.png';
import { getCorrectContrastMapTileUrl } from '../utils/map';
import leafletMarkerShadowUrl from '../../assets/images/leaflet/marker-shadow.png';
import leafletMarkerRetinaIconUrl from '../../assets/images/leaflet/marker-icon-2x.png';
import CommentFormMap from './CommentFormMap/CommentFormMap';
import CommentFormErrors from './CommentFormErrors';
import config from '../config';

Leaflet.Marker.prototype.options.icon = new Leaflet.Icon({
  iconUrl: leafletMarkerIconUrl,
  shadowUrl: leafletMarkerShadowUrl,
  iconRetinaUrl: leafletMarkerRetinaIconUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
});

const IMAGE_MAX_SIZE = 1000000;

export const BaseCommentForm = ({
  loggedIn,
  user,
  collapseForm,
  defaultNickname,
  answers,
  canComment,
  section,
  isReply,
  nicknamePlaceholder,
  hearingGeojson,
  isHighContrast,
  language,
  closed,
  overrideCollapse,
  intl,
  onOverrideCollapse,
  onPostComment,
  onChangeAnswers,
}) => {
  const [formData, setFormData] = useState({
    collapsed: true,
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
  });

  const imagesRef = useRef();

  /**
   * Determines whether the logged in user is admin or not.
   * The array in users with key adminOrganizations should be of length > 0
   */
  const isUserAdmin = useMemo(
    () => loggedIn && user && Array.isArray(user.adminOrganizations) && user.adminOrganizations.length > 0,
    [loggedIn, user],
  );

  const hasQuestions = useMemo(() => hasAnyQuestions(section), [section]);

  const userAnsweredAllQuestions = useMemo(() => loggedIn && hasUserAnsweredAllQuestions(user, section), [
    loggedIn,
    user,
    section,
  ]);

  const commentRequired = useMemo(() => isCommentRequired(hasQuestions, isReply, userAnsweredAllQuestions), [
    hasQuestions,
    isReply,
    userAnsweredAllQuestions,
  ]);

  const firstUnansweredQuestion = useMemo(() => getFirstUnansweredQuestion(user, section), [user, section]);

  const toggle = useCallback(() => {
    if (canComment) {
      setFormData({
        ...formData,
        collapsed: !formData.collapsed,
        commentText: '',
        nickname: defaultNickname || '',
        imageTooBig: false,
        images: [],
        pinned: false,
        showAlert: true,
        hideName: false,
        mapCommentText: '',
        commentRequiredError: false,
        commentOrAnswerRequiredError: false,
      });

      if (onOverrideCollapse instanceof Function) {
        onOverrideCollapse();
      }
    } else {
      localizedNotifyError(getSectionCommentingErrorMessage(section));
    }
  }, [canComment, defaultNickname, formData, onOverrideCollapse, section]);

  useEffect(() => {
    if (isUserAdmin) {
      setFormData({ ...formData, nickname: user.displayName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAdmin, user]);

  useEffect(() => {
    if (collapseForm) {
      setFormData({ ...formData, commentText: '' });
      toggle();
    }

    if (defaultNickname !== '' && !isUserAdmin) {
      setFormData({ ...formData, nickname: defaultNickname });
    }

    if (isUserAdmin && user && user.displayName) {
      setFormData({ ...formData, nickname: user.displayName });
    }

    if (answers) {
      setFormData({ ...formData, commentOrAnswerRequiredError: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapseForm, defaultNickname, isUserAdmin, user, answers]);

  const handleTextChange = (event) =>
    setFormData({
      ...formData,
      commentText: event.target.value,
      commentRequiredError: false,
      commentOrAnswerRequiredError: false,
    });

  const handleNicknameChange = (event) => setFormData({ ...formData, nickname: event.target.value });

  const hasFormErrors = () => {
    const { imageTooBig, commentRequiredError, commentOrAnswerRequiredError } = formData;

    return imageTooBig || commentRequiredError || commentOrAnswerRequiredError;
  };

  const getPluginData = () => undefined;
  const getPluginComment = () => undefined;

  const handleErrorStates = (errors) =>
    setFormData({
      ...formData,
      commentRequiredError: errors.includes('commentRequiredError'),
      commentOrAnswerRequiredError: errors.includes('commentOrAnswerRequiredError'),
      imageTooBig: errors.includes('imageTooBig'),
    });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const submitComment = () => {
    if (config.maintenanceDisableComments) {
      localizedNotifyError('maintenanceNotificationText');

      return;
    }

    const pluginComment = getPluginComment();
    let pluginData = getPluginData();

    const { nickname, commentText, geojson, images, pinned, mapCommentText, imageTooBig } = formData;

    const data = {
      nickname: nickname === '' ? nicknamePlaceholder : nickname,
      commentText: commentText === null ? '' : commentText,
      geojson,
      images,
      pinned,
      mapCommentText,
      label: null,
    };

    // plugin comment will override comment fields, if provided
    if (pluginComment) {
      data.commentText = pluginComment.content || data.commentText;
      data.nickname = pluginComment.author_name || data.nickname;
      pluginData = pluginComment.plugin_data || pluginData;
      data.label = pluginComment.label || data.label;
      data.images = pluginComment.image ? [pluginComment.image] : data.images;
      data.geojson = pluginComment.geojson || data.geojson;
      data.pinned = pluginComment.pinned || null;
      data.commentText = pluginComment.mapCommentText || data.commentText;
    } else if (pluginData && typeof pluginData !== 'string') {
      // this is for old-fashioned plugins with only data
      pluginData = JSON.stringify(pluginData);
    }

    // validate form errors here before posting the comment
    const userHasAnsweredAllQuestions = loggedIn && hasUserAnsweredAllQuestions(user, section);

    const errors = checkFormErrors(
      imageTooBig,
      data.commentText,
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
    if (isEmptyCommentAllowed(section, hasAnyAnswers(answers)) && !data.commentText.trim()) {
      data.setCommentText = config.emptyCommentString;
    }

    onPostComment(
      data.commentText,
      data.nickname,
      pluginData,
      data.geojson,
      data.label,
      data.images,
      data.pinned,
      data.commentText,
    );

    setFormData({
      ...formData,
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
    });
  };

  const isImageTooBig = (images) => {
    let imageTooBig = false;
    Array.from(images).forEach((image) => {
      if (image.size > IMAGE_MAX_SIZE) {
        imageTooBig = true;
      }
    });

    setFormData({ ...formData, imageTooBig });
  };

  const handleChange = (event) => {
    const imagePromisesArray = [];
    const images = [];

    isImageTooBig(event.target.files);

    for (let i = 0; i < imagesRef.current.files.length; i += 1) {
      imagePromisesArray.push(getImageAsBase64Promise(imagesRef.current.files[i]));
    }

    Promise.all(imagePromisesArray).then((arrayOfResults) => {
      for (let i = 0; i < imagesRef.current.files.length; i += 1) {
        const imageObject = { title: 'Title', caption: 'Caption' };

        imageObject.image = arrayOfResults[i];
        images.push(imageObject);
      }

      setFormData({ ...formData, images });
    });
  };

  /**
   * When user type is admin, an alert is shown, use this method to close the alert.
   */
  const handleCloseAlert = () =>
    setFormData({
      ...formData,
      showAlert: !formData.showAlert,
    });

  /**
   * When logged in as admin, user may chose to hide their identity.
   */
  const handleToggleHideName = () =>
    setFormData({
      ...formData,
      nickname: !formData.hideName
        ? intl.formatMessage({ id: isUserAdmin ? 'employee' : 'anonymous' })
        : user.displayName,
      hideName: !formData.hideName,
    });

  /**
   * Toggle the pinning of comment
   */
  const handleTogglePin = () =>
    setFormData({
      ...formData,
      pinned: !formData.pinned,
    });

  /**
   * When admin user is posting a comment, we will show a closeable warning.
   */
  const renderWarning = () => (
    <Alert bsStyle='warning'>
      <div className='comment-form__comment-alert'>
        <div className='comment-form__comment-alert__alert-icon'>
          <Icon name='info-circle' size='lg' />
        </div>
        <span className='comment-form__comment-alert__alert-message'>
          {isUserAdmin ? (
            <FormattedMessage id='adminCommentMessage' />
          ) : (
            <FormattedMessage id='registeredUserCommentMessage' />
          )}
        </span>
        <div className='comment-form__comment-alert__alert-close'>
          <Icon name='close' onClick={handleCloseAlert} />
        </div>
      </div>
    </Alert>
  );

  /**
   * Render the checkbox to hide user name and identitiy for admin user.
   */
  const renderHideNameOption = () => (
    <Checkbox checked={formData.hideName} key={uuid()} onChange={() => handleToggleHideName()}>
      <FormattedMessage id='hideName' />
    </Checkbox>
  );

  /**
   * For admins, there is slightly different form.
   */
  const renderFormForAdmin = () => {
    const organization = isUserAdmin && user.adminOrganizations[0];

    return (
      <FormGroup>
        <FormControl
          type='text'
          placeholder={nicknamePlaceholder}
          value={formData.nickname}
          onChange={handleNicknameChange}
          maxLength={32}
          disabled
        />
        <FormControl
          type='text'
          placeholder={intl.formatMessage({ id: 'organization' })}
          value={organization || ''}
          onChange={() => {}}
          maxLength={32}
          disabled
        />
      </FormGroup>
    );
  };

  /**
   * If an admin type of user is posting comment, the form is slightly different.
   * @returns {JSX<Component>}
   */
  const renderNameFormForUser = () => {
    const headingId = isUserAdmin ? 'nameAndOrganization' : 'nickname';

    return (
      <>
        <label htmlFor='commentNickname' className='h4'>
          <FormattedMessage id={headingId} />
        </label>
        {loggedIn && formData.showAlert && renderWarning()}
        {loggedIn && renderHideNameOption()}
        {isUserAdmin ? (
          <div className='comment-form__group-admin'>{renderFormForAdmin()}</div>
        ) : (
          <FormGroup>
            <FormControl
              id='commentNickname'
              type='text'
              placeholder={nicknamePlaceholder}
              value={formData.nickname}
              onChange={handleNicknameChange}
              maxLength={32}
            />
          </FormGroup>
        )}
      </>
    );
  };

  /**
   * When user is of admin type, they are allowed to pin a comment to top.
   * In the form, an icon can be shown to pin or unpin the comment.
   */
  const renderPinUnpinIcon = () => (
    <Button
      className={classnames([
        'comment-form__heading-container__pin__icon',
        {
          'comment-form__heading-container__pin__pin-comment': !formData.pinned,
          'comment-form__heading-container__pin__unpin-comment': formData.pinned,
        },
      ])}
      onClick={handleTogglePin}
    />
  );

  const onDrawCreate = (event) => setFormData({ ...formData, geojson: event.layer.toGeoJSON().geometry });

  const onDrawDelete = () => setFormData({ ...formData, geojson: null });

  const handleMapTextChange = (event) => setFormData({ ...formData, mapCommentText: event.target.value });

  const getMapElement = (geojson) => {
    switch (geojson.type) {
      case 'Polygon': {
        // XXX: This only supports the _first_ ring of coordinates in a Polygon
        const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
        return <Polygon key={Math.random()} positions={latLngs} color='transparent' />;
      }
      case 'Point': {
        const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
        return <Circle center={latLngs} radius={10} color='transparent' />;
      }
      case 'LineString': {
        const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
        return <Polyline key={Math.random()} positions={latLngs} color='transparent' />;
      }
      case 'Feature': {
        return getMapElement(geojson.geometry);
      }
      default:
        // This should never happen
        return <GeoJSON data={geojson} key={JSON.stringify(geojson)} color='transparent' />;
    }
  };

  const getMapBorder = () => {
    if (hearingGeojson && hearingGeojson.type !== 'Point') {
      const contents = [];
      if (hearingGeojson.type === 'FeatureCollection') {
        hearingGeojson.features.forEach((feature) => {
          contents.push(getMapElement(feature));
        });
      } else {
        contents.push(getMapElement(hearingGeojson));
      }
      return contents;
    }
    return null;
  };

  const getMapCenter = () => {
    let center;
    if (hearingGeojson && hearingGeojson.type === 'Point') {
      center = new LatLng(hearingGeojson.coordinates[1], hearingGeojson.coordinates[0]);
    } else {
      center = new LatLng(localization.mapPosition[0], localization.mapPosition[1]);
    }
    return center;
  };

  const getMapContrastTiles = () =>
    getCorrectContrastMapTileUrl(urls.rasterMapTiles, urls.highContrastRasterMapTiles, isHighContrast, language);

  if (!overrideCollapse && formData.collapsed) {
    return (
      <Button onClick={toggle} bsStyle='primary' bsSize='large' block>
        <Icon name='comment' /> <FormattedMessage id={hasQuestions ? 'addCommentAndVote' : 'addComment'} />
      </Button>
    );
  }

  return (
    <div className='comment-form'>
      <form>
        <h2>
          <FormattedMessage id='writeComment' />
        </h2>
        <p>
          <FormattedMessage id={commentRequired ? 'commentHelpStarRequired' : 'commentHelpAnswerOrCommentRequired'} />
        </p>
        {!isReply &&
          section.questions.map((question) => {
            const canShowQuestionResult =
              closed || (loggedIn && includes(get(user, 'answered_questions'), question.id));

            return canShowQuestionResult ? (
              <QuestionResults key={question.id} question={question} lang={language} />
            ) : null;
          })}
        {!isReply &&
          section.questions.map((question) => {
            const canShowQuestionForm = !closed && !includes(get(user, 'answered_questions'), question.id);

            return canShowQuestionForm ? (
              <QuestionForm
                // give focus when there are unanswered questions
                autoFocus={!!firstUnansweredQuestion && firstUnansweredQuestion.id === question.id}
                key={question.id}
                canAnswer={canComment}
                answers={answers.find((answer) => answer.question === question.id)}
                onChange={onChangeAnswers}
                question={question}
                lang={language}
              />
            ) : null;
          })}
        <div className='comment-form__heading-container'>
          <div className='comment-form__heading-container__title'>
            <label htmlFor='commentTextField' className='h4'>
              <FormattedMessage id='writeComment' />
              {commentRequired && <span aria-hidden='true'>*</span>}
            </label>
          </div>
          {isUserAdmin && !isReply && (
            <div className='comment-form__heading-container__pin'>{renderPinUnpinIcon()}</div>
          )}
        </div>
        <FormControl
          // set focus when there are no questions before to be answered
          autoFocus={isReply || !firstUnansweredQuestion}
          componentClass='textarea'
          value={formData.commentText}
          onChange={handleTextChange}
          id='commentTextField'
          required={commentRequired}
        />
        {isSectionCommentingMapEnabled(user, section) && (
          <div className='comment-form__map-container' style={{ marginTop: 20 }}>
            <div>
              <label htmlFor='commentMapAddress'>
                <FormattedMessage id='commentMapTitle' />
              </label>
            </div>
            <FormattedMessage id='commentMapInstructions'>
              {(instr) => <span style={{ fontSize: 13 }}>{instr}</span>}
            </FormattedMessage>
            <div className='map-padding'>
              <CommentFormMap
                center={getMapCenter()}
                mapBounds={localization.mapBounds || null}
                mapTileUrl={getMapContrastTiles()}
                onDrawCreate={onDrawCreate}
                onDrawDelete={onDrawDelete}
                contents={getMapBorder()}
                tools={section.commenting_map_tools}
                language={language}
              />
            </div>
            <FormGroup>
              <ControlLabel htmlFor='map_text'>
                <FormattedMessage id='commentMapAdditionalInfo' />
              </ControlLabel>
              <FormControl
                id='map_text'
                type='text'
                value={formData.mapCommentText}
                onChange={handleMapTextChange}
                maxLength={128}
              />
            </FormGroup>
          </div>
        )}

        <div className='comment-form__selected-images'>
          {formData.imageTooBig ? (
            <div className='comment-form__image-too-big'>
              <FormattedMessage id='imageSizeError' />
            </div>
          ) : (
            formData.images.map((image) => (
              <img
                style={{ marginRight: 10 }}
                alt=''
                src={image.image}
                width={image.width < 100 ? image.width : 100}
                height={image.height < 100 ? image.width : 100}
                key={Buffer.from(image.image).toString('base64')}
              />
            ))
          )}
        </div>
        <FormGroup className='comment-form__file'>
          <ControlLabel>
            <FormattedMessage id='add_images' />
          </ControlLabel>
          <div className='comment-form__select-file'>
            <input
              type='file'
              ref={imagesRef}
              id='fileInput'
              multiple
              className='custom-file-input'
              onChange={(event) => handleChange(event)}
            />
            <label className='btn btn-default btn-sm' htmlFor='fileInput'>
              <FormattedMessage id='choose_images' />
            </label>
          </div>
          <span style={{ fontSize: 13, marginTop: 20 }}>
            <FormattedMessage id='multipleImages' />
          </span>
        </FormGroup>
        {renderNameFormForUser()}
        <div className='comment-buttons clearfix'>
          <Button bsStyle='default' onClick={toggle}>
            <FormattedMessage id='cancel' />
          </Button>
          <Button
            bsStyle='primary'
            aria-disabled={hasFormErrors()}
            className={hasFormErrors() ? 'disabled' : null}
            onClick={submitComment}
          >
            <FormattedMessage id='submit' />
          </Button>
        </div>
        <CommentFormErrors
          commentRequiredError={formData.commentRequiredError}
          commentOrAnswerRequiredError={formData.commentOrAnswerRequiredError}
          imageTooBig={formData.imageTooBig}
        />
        <CommentDisclaimer />
      </form>
    </div>
  );
};

BaseCommentForm.propTypes = {
  canComment: PropTypes.bool,
  onPostComment: PropTypes.func,
  onOverrideCollapse: PropTypes.func,
  intl: intlShape.isRequired,
  collapseForm: PropTypes.bool,
  defaultNickname: PropTypes.string,
  overrideCollapse: PropTypes.bool,
  nicknamePlaceholder: PropTypes.string,
  section: PropTypes.object,
  language: PropTypes.string,
  onChangeAnswers: PropTypes.func,
  answers: PropTypes.array,
  loggedIn: PropTypes.bool,
  closed: PropTypes.bool,
  user: PropTypes.object,
  isReply: PropTypes.bool,
  isHighContrast: PropTypes.bool,
  hearingGeojson: PropTypes.object,
};

BaseCommentForm.defaultProps = {
  defaultNickname: '',
  overrideCollapse: false,
  onOverrideCollapse: () => {},
  isReply: false,
};

export const BaseCommentFormDefaulProps = BaseCommentForm.propTypes;

const mapStateToProps = (state) => ({
  isHighContrast: state.accessibility.isHighContrast,
});

const WrappedBaseCommentForm = connect(mapStateToProps, null)(injectIntl(BaseCommentForm));

export default WrappedBaseCommentForm;
