/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import {
  addOption,
  addSectionAttachment,
  addMapMarker,
  addMapMarkerToCollection,
  changeHearing,
  changeHearingEditorLanguages,
  changeSection,
  changeSectionMainImage,
  clearQuestions,
  closeHearing,
  closeHearingForm,
  createMapMarker,
  deleteLastOption,
  deleteSectionAttachment,
  deleteTemporaryQuestion,
  editQuestion,
  editSectionAttachment,
  editSectionAttachmentOrder,
  initMultipleChoiceQuestion,
  initSingleChoiceQuestion,
  deleteExistingQuestion,
  publishHearing,
  saveAndPreviewHearingChanges,
  saveAndPreviewNewHearing,
  saveAndPreviewHearingAsCopy,
  saveHearingChanges,
  sectionMoveDown,
  sectionMoveUp,
  startHearingEdit,
  unPublishHearing,
  fetchHearingEditorContactPersons,
} from '../../actions/hearingEditor';
import { deleteHearingDraft } from '../../actions/index';
import HearingForm from './HearingForm';
import HearingToolbar from './HearingToolbar';
import { contactShape, hearingShape, labelShape, organizationShape, userShape } from '../../types';
import * as EditorSelector from '../../selectors/hearingEditor';
import validateFunction from '../../utils/validation';
import CommentReportModal from '../CommentReportModal/CommentReportModal';
import { addToast } from '../../actions/toast';

const HearingEditor = (props) => {

  const [errors, setErrors] = useState({});
  const [commentReportsOpen, setCommentReportsOpen] = useState(false);
  const {
    contactPersons,
    isNewHearing,
    fetchEditorContactPersons,
    organizations,
    hearing,
    hearingLanguages,
    labels,
    show,
    language,
    user,
    intl
  } = props;
  const navigate = useNavigate();
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchEditorContactPersons();
  }, [fetchEditorContactPersons]);


/**
   * Check if the hearing has all of the required properties.
   * Returns notification and highlights faulty inputs in the form if errors are found,
   * otherwise dispatch the callbackAction.
   * @param {function} callbackAction
   * @returns {void|*}
   */
const validateHearing = (callbackAction) => {
  // each key corresponds to that step in the form, ie. 1 = HearingFormStep1 etc
  const localErrors = { 1: {}, 4: {}, 5: {} };

  if (validateFunction.title(hearing.title, hearingLanguages)) {
    localErrors[1].title = formatMessage({ id: 'validationHearingTitle' });
  }
  if (validateFunction.labels(hearing.labels)) {
    localErrors[1].labels = formatMessage({ id: 'validationHearingLabels' });
  }
  if (validateFunction.slug(hearing.slug)) {
    localErrors[1].slug = formatMessage({ id: 'validationHearingSlug' });
  }
  if (validateFunction.contact_persons(hearing.contact_persons)) {
    localErrors[1].contact_persons = formatMessage({ id: 'validationHearingContactPersons' });
  }
  if (validateFunction.open_at(hearing.open_at)) {
    localErrors[4].open_at = formatMessage({ id: 'validationHearingOpenAt' });
  }
  if (validateFunction.close_at(hearing.close_at)) {
    localErrors[4].close_at = formatMessage({ id: 'validationHearingCloseAt' });
  }
  // project is not mandatory, but if a project is given, it must have certain properties
  if (validateFunction.project(hearing.project)) {
    if (validateFunction.project_title(hearing.project.title, hearingLanguages)) {
      localErrors[5].project_title = formatMessage({ id: 'validationHearingProjectTitle' });
    }
    if (validateFunction.project_phases_title(hearing.project.phases, hearingLanguages)) {
      localErrors[5].project_phase_title = formatMessage({ id: 'validationHearingProjectPhaseTitle' });
    }
    if (validateFunction.project_phases_active(hearing.project.phases)) {
      localErrors[5].project_phase_active = formatMessage({ id: 'validationHearingProjectPhaseActive' });
    }
  }

  // true if one of the keys in localErrors contain entries
  // eslint-disable-next-line no-unused-vars
  setErrors(localErrors);
  const containsError = Object.entries(localErrors).some(([, v]) => Object.entries(v).length > 0);
  if (!containsError) {
    dispatch(callbackAction(hearing)).then(() => {
      navigate(`/${hearing.slug}?lang=${language}`)
    });
  } else {
    dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'validationNotification')));
  }
};


  const onHearingChange = (field, value) => dispatch(changeHearing(field, value));

  const onSectionChange = (sectionID, field, value) => dispatch(changeSection(sectionID, field, value));

  const onCreateMapMarker = (value) => dispatch(createMapMarker(value));

  const onAddMapMarker = (value) => dispatch(addMapMarker(value));

  const onAddMapMarkersToCollection = (value) => dispatch(addMapMarkerToCollection(value));

  /**
   * Add a new attachments to a section.
   * The upload happens as soon as user selects a file to upload.
   */
  const onSectionAttachment = (sectionId, attachments, attachmentProperties) => {
    dispatch(addSectionAttachment(sectionId, attachments, attachmentProperties, hearing.isNew));
  };

  /**
   * When we need to edit the order of attachments.
   */
  const onEditSectionAttachmentOrder = (sectionId, attachments) => {
    dispatch(editSectionAttachmentOrder(sectionId, attachments));
  };

  /**
   * When section attachment is modified.
   */
  const onSectionAttachmentEdit = (sectionId, attachments) => {
    dispatch(editSectionAttachment(sectionId, attachments));
  };

  /**
   * When section attachment is deleted.
   */
  const onSectionAttachmentDelete = (sectionId, attachments) => {
    dispatch(deleteSectionAttachment(sectionId, attachments));
  };

  const onQuestionChange = (fieldType, sectionId, questionId, optionKey, value) => {
    dispatch(editQuestion(fieldType, sectionId, questionId, optionKey, value));
  };

  const onDeleteTemporaryQuestion = (sectionId, questionFrontId) => {
    dispatch(deleteTemporaryQuestion(sectionId, questionFrontId));
  };

  /**
   * Delete a question from section which has been stored in database
   */
  const onDeleteExistingQuestion = (sectionId, questionFrontId) => {
    dispatch(deleteExistingQuestion(sectionId, questionFrontId));
  };

  const onSectionImageChange = (sectionID, field, value) => {
    dispatch(changeSectionMainImage(sectionID, field, value));
  }

  const onLanguagesChange = (newLanguages) => dispatch(changeHearingEditorLanguages(newLanguages));

  const onPublish = () => dispatch(publishHearing(hearing));

  const onSaveAsCopy = () => validateHearing(saveAndPreviewHearingAsCopy);

  const onSaveAndPreview = () => {
    if (hearing.isNew) {
      validateHearing(saveAndPreviewNewHearing);
    } else {
      validateHearing(saveAndPreviewHearingChanges);
    }
  }

  const onSaveChanges = () => validateHearing(saveHearingChanges);

  const onUnPublish = () => dispatch(unPublishHearing(hearing));

  const onCloseHearing = () => dispatch(closeHearing(hearing));

  const sectionMoveUpFn = (sectionId) => dispatch(sectionMoveUp(sectionId));

  const sectionMoveDownFn = (sectionId) => dispatch(sectionMoveDown(sectionId));

  const onDeleteHearingDraft = () => {
    dispatch(deleteHearingDraft(hearing.id, hearing.slug)).then((value) => {
      console.debug(value);
      navigate('/hearings/list')
    });
  };

  const initSingleChoiceQuestionFn = (sectionId) => {
    dispatch(initSingleChoiceQuestion(sectionId));
  };

  const initMultipleChoiceQuestionFn = (sectionId) => {
    dispatch(initMultipleChoiceQuestion(sectionId));
  };

  const clearQuestionsFn = (sectionId) => dispatch(clearQuestions(sectionId));

  const addOptionFn = (sectionId, questionId) => dispatch(addOption(sectionId, questionId));

  const deleteOption = (sectionId, questionId) => dispatch(deleteLastOption(sectionId, questionId));

  const toggleCommentReports = () => setCommentReportsOpen(!commentReportsOpen);

  const getHearingForm = () => {
    if (isEmpty(hearing)) {
      return null;
    }
    return (
      <HearingForm
        addOption={addOptionFn}
        clearQuestions={clearQuestionsFn}
        contactPersons={contactPersons}
        organizations={organizations}
        currentStep={1}
        deleteOption={deleteOption}
        dispatch={dispatch}
        errors={errors}
        hearing={hearing}
        hearingLanguages={hearingLanguages}
        initMultipleChoiceQuestion={initMultipleChoiceQuestionFn}
        initSingleChoiceQuestion={initSingleChoiceQuestionFn}
        labels={labels}
        language={language}
        onAddMapMarker={onAddMapMarker}
        onAddMapMarkersToCollection={onAddMapMarkersToCollection}
        onCreateMapMarker={onCreateMapMarker}
        onDeleteExistingQuestion={onDeleteExistingQuestion}
        onDeleteTemporaryQuestion={onDeleteTemporaryQuestion}
        onEditSectionAttachmentOrder={onEditSectionAttachmentOrder}
        onHearingChange={onHearingChange}
        onLanguagesChange={onLanguagesChange}
        onLeaveForm={() => dispatch(closeHearingForm())}
        onQuestionChange={onQuestionChange}
        onSaveAndPreview={onSaveAndPreview}
        onSaveChanges={onSaveChanges}
        onSaveAsCopy={onSaveAsCopy}
        onSectionAttachment={onSectionAttachment}
        onSectionAttachmentDelete={onSectionAttachmentDelete}
        onSectionAttachmentEdit={onSectionAttachmentEdit}
        onSectionChange={onSectionChange}
        onSectionImageChange={onSectionImageChange}
        sectionMoveDown={sectionMoveDownFn}
        sectionMoveUp={sectionMoveUpFn}
        sections={hearing.sections}
        show={show}
      />
    );
  }

  return (
    <div className='hearing-editor'>
      {getHearingForm()}

      {!isNewHearing && contactPersons.length && labels.length && organizations.length && (
        <>
          <HearingToolbar
            hearing={hearing}
            onCloseHearing={onCloseHearing}
            onEdit={() => dispatch(startHearingEdit())}
            onPublish={onPublish}
            onReportsClick={toggleCommentReports}
            onRevertPublishing={onUnPublish}
            user={user}
            onDeleteHearingDraft={onDeleteHearingDraft}
          />
          <CommentReportModal
            hearing={hearing}
            isOpen={commentReportsOpen}
            onClose={toggleCommentReports}
          />
        </>
      )}
    </div>
  );
}

HearingEditor.propTypes = {
  contactPersons: PropTypes.arrayOf(contactShape),
  organizations: PropTypes.arrayOf(organizationShape),
  show: PropTypes.bool,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(labelShape),
  user: userShape,
  language: PropTypes.string,
  isNewHearing: PropTypes.bool,
  intl: PropTypes.object,
  fetchEditorContactPersons: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  fetchEditorContactPersons: () => dispatch(fetchHearingEditorContactPersons()),
});

const mapStateToProps = (state) => ({
  show: EditorSelector.getShowForm(state),
  language: state.language,
  contactPersons: EditorSelector.getContactPersons(state),
});

export { HearingEditor as UnconnectedHearingEditor };

const WrappedHearingEditor = connect(mapStateToProps, mapDispatchToProps)(injectIntl(HearingEditor));

export default WrappedHearingEditor;
