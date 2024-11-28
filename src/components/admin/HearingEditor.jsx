/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { validateHearing as validateHearingFn } from '../../utils/hearingEditor';
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
import CommentReportModal from '../CommentReportModal/CommentReportModal';
import { addToast } from '../../actions/toast';

const HearingEditor = (props) => {

  const [errors, setErrors] = useState({});
  const [shouldSubmit, setShouldSubmit] = useState(false);
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
    editorErrors,
    editorIsSaving,
  } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchEditorContactPersons();
  }, [fetchEditorContactPersons]);

  const checkIfEmpty = (obj) => !Object.entries(obj).some(([, v]) => Object.entries(v).length > 0);

  /**
   * Should only navigate if the hearing is valid and the editor is not saving.
   * This is to give errors from backend time to get to state.
   */
  useEffect(() => {
    if (shouldSubmit && !editorIsSaving) {
      if (isEmpty(editorErrors) && checkIfEmpty(errors)) {
        navigate(`/${hearing.slug}?lang=${language}`)
      } else {
        setShouldSubmit(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSubmit, editorIsSaving]);


  /**
     * Check if the hearing has all of the required properties.
     * Returns notification and highlights faulty inputs in the form if errors are found,
     * otherwise dispatch the callbackAction.
     * sets should Submit to true if the hearing is valid and the callbackAction is dispatched
     * so we can handle error cases from the backend.
     * @param {function} callbackAction
     * @returns {void|*}
     */
  const validateHearing =  (callbackAction) => {
    const localErrors = validateHearingFn(hearing, hearingLanguages);

    // true if one of the keys in localErrors contain entries
    // eslint-disable-next-line no-unused-vars
    setErrors(localErrors);
    const containsError = checkIfEmpty(localErrors);
    if (containsError) {
      dispatch(callbackAction(hearing)).then(() => setShouldSubmit(true));
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
    dispatch(deleteHearingDraft(hearing.id, hearing.slug)).then(() => {
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
  editorErrors: PropTypes.object,
  editorIsSaving: PropTypes.bool,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(labelShape),
  user: userShape,
  language: PropTypes.string,
  isNewHearing: PropTypes.bool,
  fetchEditorContactPersons: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  fetchEditorContactPersons: () => dispatch(fetchHearingEditorContactPersons()),
});

const mapStateToProps = (state) => ({
  show: EditorSelector.getShowForm(state),
  editorErrors: EditorSelector.getEditorErrors(state),
  editorIsSaving: EditorSelector.getIsSaving(state),
  language: state.language,
  contactPersons: EditorSelector.getContactPersons(state),
});

export { HearingEditor as UnconnectedHearingEditor };

const WrappedHearingEditor = connect(mapStateToProps, mapDispatchToProps)(HearingEditor);

export default WrappedHearingEditor;
