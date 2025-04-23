/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable sonarjs/no-uniq-key */
/* eslint-disable import/no-unresolved */
import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Checkbox, Fieldset, FileInput, Notification, TextArea, TextInput } from 'hds-react';
import classnames from 'classnames';
import { connect, useDispatch } from 'react-redux';
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
import { addToast } from '../actions/toast';
import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../utils/notify';
import { ACCEPTED_IMAGE_TYPES } from '../utils/constants';

Leaflet.Marker.prototype.options.icon = new Leaflet.Icon({
  iconUrl: leafletMarkerIconUrl,
  shadowUrl: leafletMarkerShadowUrl,
  iconRetinaUrl: leafletMarkerRetinaIconUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
});
const IMAGE_MAX_SIZE = 1000000;

const BaseCommentForm = ({
  loggedIn,
  user,
  collapseForm,
  defaultNickname = '',
  answers,
  canComment,
  section,
  isReply = false,
  nicknamePlaceholder,
  hearingGeojson,
  isHighContrast,
  language,
  closed,
  overrideCollapse = false,
  onOverrideCollapse = () => {},
  onPostComment,
  onChangeAnswers,
}) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  /**
   * Determines whether the logged in user is admin or not.
   * The array in users with key adminOrganizations should be of length > 0
   */
  const isUserAdmin = useMemo(
    () => loggedIn && user && Array.isArray(user.adminOrganizations) && user.adminOrganizations.length > 0,
    [loggedIn, user],
  );

  const formInitialSettings = {
    nickname: isUserAdmin ? user.displayName : defaultNickname,
    pinned: false,
    showAlert: true,
    hideName: false,
    organization: isUserAdmin ? user.adminOrganizations[0] : undefined,
    collapsed: collapseForm || true,
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
    commentRequiredError: false,
    commentOrAnswerRequiredError: false,
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

  const hasQuestions = useMemo(() => hasAnyQuestions(section), [section]);

  const userAnsweredAllQuestions = useMemo(
    () => loggedIn && hasUserAnsweredAllQuestions(user, section),
    [loggedIn, user, section],
  );

  const commentRequired = useMemo(
    () => isCommentRequired(hasQuestions, isReply, userAnsweredAllQuestions),
    [hasQuestions, isReply, userAnsweredAllQuestions],
  );

  const firstUnansweredQuestion = useMemo(() => getFirstUnansweredQuestion(user, section), [user, section]);

  const toggle = useCallback(() => {
    if (canComment) {
      setFormSettings((prevState) => ({ ...prevState, collapsed: !formSettings.collapsed }));

      if (onOverrideCollapse instanceof Function) {
        onOverrideCollapse();
      }
    } else {
      dispatch(
        addToast(
          createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, getSectionCommentingErrorMessage(section)),
        ),
      );
    }
  }, [canComment, dispatch, formSettings, onOverrideCollapse, section]);

  const handleTextChange = (event) => {
    setComment(event.target.value);
    setFormErrors((prevState) => ({ ...prevState, commentRequiredError: false, commentOrAnswerRequiredError: false }));
  };

  const handleNicknameChange = (event) => {
    setFormSettings((prevState) => ({ ...prevState, nickname: event.target.value }));
  };

  const hasFormErrors = () => {
    const { imageTooBig, commentRequiredError, commentOrAnswerRequiredError } = formErrors;

    return imageTooBig || commentRequiredError || commentOrAnswerRequiredError;
  };

  const getPluginData = () => undefined;
  const getPluginComment = () => undefined;

  const handleErrorStates = (errors) => {
    setFormErrors({
      commentRequiredError: errors.includes('commentRequiredError'),
      commentOrAnswerRequiredError: errors.includes('commentOrAnswerRequiredError'),
      imageTooBig: errors.includes('imageTooBig'),
    });
  };

  const submitComment = () => {
    if (config.maintenanceDisableComments) {
      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'maintenanceNotificationText')));
      return;
    }

    const pluginComment = getPluginComment();
    let pluginData = getPluginData();

    const { nickname, pinned, organization } = formSettings;
    const { geojson, mapCommentText } = commentGeoJson;
    const { imageTooBig } = formErrors;

    const commentText = comment;
    const images = commentImages;

    const data = {
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
      data.commentText = pluginComment.content || data.commentText;
      data.nickname = pluginComment.author_name || data.nickname;
      pluginData = pluginComment.plugin_data || pluginData;
      data.label = pluginComment.label || data.label;
      data.images = pluginComment.image ? [pluginComment.image] : data.images;
      data.geojson = pluginComment.geojson || data.geojson;
      data.pinned = pluginComment.pinned || null;
      data.mapCommentText = pluginComment.mapCommentText || data.commentText;
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
      data.commentText = config.emptyCommentString;
    }

    onPostComment({
      text: data.commentText,
      authorName: data.nickname,
      pluginData,
      geojson: data.geojson,
      label: data.label,
      images: data.images,
      pinned: data.pinned,
      mapCommentText: data.mapCommentText,
      organization: data.organization ?? undefined,
    });

    resetForm();
  };

  const isImageTooBig = (images) => {
    let imageTooBig = false;
    Array.from(images).forEach((image) => {
      if (image.size > IMAGE_MAX_SIZE) {
        imageTooBig = true;
      }
    });

    setFormErrors((prevState) => ({ ...prevState, imageTooBig }));
  };

  const handleChange = (files) => {
    isImageTooBig(files);

    const imagePromisesArray = files.map((image) => getImageAsBase64Promise(image));

    Promise.all(imagePromisesArray).then((arrayOfResults) => {
      const images = arrayOfResults.map((result) => {
        const imageObject = { title: 'Title', caption: 'Caption' };

        imageObject.image = result;

        return imageObject;
      });

      setCommentImages(images);
    });
  };

  /**
   * When logged in as admin, user may chose to hide their identity.
   */
  const handleToggleHideName = () => {
    setFormSettings((prevState) => ({
      ...prevState,
      nickname: !prevState.hideName
        ? intl.formatMessage({ id: isUserAdmin ? 'employee' : 'anonymous' })
        : user.displayName,
      hideName: !prevState.hideName,
    }));
  };

  /**
   * Toggle the pinning of comment
   */
  const handleTogglePin = () => {
    setFormSettings((prevState) => ({
      ...prevState,
      pinned: !prevState.pinned,
    }));
  };

  /**
   * When admin user is posting a comment, we will show a closeable warning.
   */
  const renderWarning = () => (
    <Notification type='alert' style={{ marginBottom: 'var(--spacing-s)' }}>
      {isUserAdmin ? (
        <FormattedMessage id='adminCommentMessage' />
      ) : (
        <FormattedMessage id='registeredUserCommentMessage' />
      )}
    </Notification>
  );

  /**
   * Render the checkbox to hide user name and identitiy for admin user.
   */
  const renderHideNameOption = () => (
    <Checkbox
      label={<FormattedMessage id='hideName' />}
      checked={formSettings.hideName}
      key='hide-user-name'
      id='hide-user-name'
      onChange={() => handleToggleHideName()}
      style={{ marginBottom: 'var(--spacing-s)' }}
    />
  );

  /**
   * For admins, there is slightly different form.
   */
  const renderFormForAdmin = () => (
    <>
      <TextInput
        label={<FormattedMessage id='nickname' />}
        hideLabel
        id='nickname'
        placeholder={nicknamePlaceholder}
        value={formSettings.nickname}
        onChange={handleNicknameChange}
        maxLength={32}
        disabled
      />
      <TextInput
        label={<FormattedMessage id='organization' />}
        hideLabel
        id='organization'
        placeholder={intl.formatMessage({ id: 'organization' })}
        value={formSettings.organization}
        onChange={() => {}}
        maxLength={32}
        disabled
      />
    </>
  );

  /**
   * If an admin type of user is posting comment, the form is slightly different.
   * @returns {JSX<Component>}
   */
  const renderNameFormForUser = () => {
    const warning = loggedIn && formSettings.showAlert && renderWarning();
    const hideName = loggedIn && renderHideNameOption();

    if (isUserAdmin) {
      return (
        <Fieldset heading={<FormattedMessage id='nameAndOrganization' />}>
          {warning}
          {hideName}
          <div className='comment-form__group-admin'>{renderFormForAdmin()}</div>
        </Fieldset>
      );
    }

    return (
      <>
        {warning}
        {hideName}
        <TextInput
          id='nickname'
          label={<FormattedMessage id='nickname' />}
          placeholder={nicknamePlaceholder}
          value={formSettings.nickname}
          onChange={handleNicknameChange}
          maxLength={32}
        />
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
          'comment-form__heading-container__pin__pin-comment': !formSettings.pinned,
          'comment-form__heading-container__pin__unpin-comment': formSettings.pinned,
        },
      ])}
      onClick={handleTogglePin}
    />
  );

  const onDrawCreate = (event) => {
    setCommentGeoJson((prevState) => ({ ...prevState, geojson: event.layer.toGeoJSON().geometry }));
  };

  const onDrawDelete = () => {
    setCommentGeoJson((prevState) => ({ ...prevState, geojson: null }));
  };

  const handleMapTextChange = (event) => {
    setCommentGeoJson((prevState) => ({ ...prevState, mapCommentText: event.target.value }));
  };

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

  if (!overrideCollapse && formSettings.collapsed) {
    return (
      <Button onClick={toggle} className='kerrokantasi-btn black' size='large' fullWidth>
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
          {isUserAdmin && !isReply && (
            <div className='comment-form__heading-container__pin'>{renderPinUnpinIcon()}</div>
          )}
          <TextArea
            id='write-comment'
            data-testid='write-comment'
            label={<FormattedMessage id='writeComment' />}
            // set focus when there are no questions before to be answered
            autoFocus={isReply || !firstUnansweredQuestion}
            value={comment}
            onChange={handleTextChange}
            required={commentRequired}
          />
        </div>
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
            <div>
              <TextInput
                id='comment-map-info'
                label={<FormattedMessage id='commentMapAdditionalInfo' />}
                value={commentGeoJson.mapCommentText}
                onChange={handleMapTextChange}
                maxLength={128}
              />
            </div>
          </div>
        )}

        <div className='comment-form__selected-images'>
          {formErrors.imageTooBig && (
            <div className='comment-form__image-too-big'>
              <FormattedMessage id='imageSizeError' />
            </div>
          )}
        </div>
        <div className='comment-form__file'>
          <div className='comment-form__select-file'>
            <FileInput
              id='fileInput'
              defaultValue={commentImages}
              className='custom-file-input'
              multiple
              accept={ACCEPTED_IMAGE_TYPES}
              label={<FormattedMessage id='add_images' />}
              onChange={(files) => handleChange(files)}
              maxSize={IMAGE_MAX_SIZE}
            />
          </div>
          <span style={{ fontSize: 13, marginTop: 20 }}>
            <FormattedMessage id='multipleImages' />
          </span>
        </div>
        {renderNameFormForUser()}
        <div className='comment-buttons clearfix'>
          <Button className='kerrokantasi-btn' onClick={toggle}>
            <FormattedMessage id='cancel' />
          </Button>
          <Button
            aria-disabled={hasFormErrors()}
            className={classnames({ disabled: hasFormErrors() }, 'kerrokantasi-btn black')}
            onClick={submitComment}
          >
            <FormattedMessage id='submit' />
          </Button>
        </div>
        <CommentFormErrors
          commentRequiredError={formErrors.commentRequiredError}
          commentOrAnswerRequiredError={formErrors.commentOrAnswerRequiredError}
          imageTooBig={formErrors.imageTooBig}
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

const mapStateToProps = (state) => ({
  isHighContrast: state.accessibility.isHighContrast,
});

export default connect(mapStateToProps, null)(BaseCommentForm);
