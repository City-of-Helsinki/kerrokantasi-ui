import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {isEmpty} from 'lodash';
import {notifyError} from '../../utils/notify';
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
  saveHearingChanges,
  sectionMoveDown,
  sectionMoveUp,
  startHearingEdit,
  unPublishHearing,
} from '../../actions/hearingEditor';
import {deleteHearingDraft} from '../../actions/index';
import HearingForm from './HearingForm';
import HearingToolbar from './HearingToolbar';
import {contactShape, hearingShape, labelShape, userShape} from '../../types';
import * as EditorSelector from '../../selectors/hearingEditor';
import validateFunction from '../../utils/validation';


class HearingEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onCloseHearing = this.onCloseHearing.bind(this);
    this.onHearingChange = this.onHearingChange.bind(this);
    this.onLanguagesChange = this.onLanguagesChange.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.onSaveAndPreview = this.onSaveAndPreview.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onSaveAsCopy = this.onSaveAsCopy.bind(this);
    this.onSectionChange = this.onSectionChange.bind(this);
    this.onSectionImageChange = this.onSectionImageChange.bind(this);
    this.onUnPublish = this.onUnPublish.bind(this);

    this.state = {
      errors: {}
    };
  }

  onHearingChange = (field, value) => {
    this.props.dispatch(changeHearing(field, value));
  }

  onSectionChange = (sectionID, field, value) => {
    this.props.dispatch(changeSection(sectionID, field, value));
  }
  onCreateMapMarker = (value) => {
    this.props.dispatch(createMapMarker(value));
  }
  onAddMapMarker = (value) => {
    this.props.dispatch(addMapMarker(value));
  }
  onAddMapMarkersToCollection = (value) => {
    this.props.dispatch(addMapMarkerToCollection(value));
  }

  /**
   * Add a new attachments to a section.
   * The upload happens as soon as user selects a file to upload.
   */
  onSectionAttachment = (sectionId, attachments, attachmentProperties) => {
    this.props.dispatch(addSectionAttachment(sectionId, attachments, attachmentProperties, this.props.hearing.isNew));
  }

  /**
   * When we need to edit the order of attachments.
   */
  onEditSectionAttachmentOrder = (sectionId, attachments) => {
    this.props.dispatch(editSectionAttachmentOrder(sectionId, attachments));
  }

  /**
   * When section attachment is modified.
   */
  onSectionAttachmentEdit = (sectionId, attachments) => {
    this.props.dispatch(editSectionAttachment(sectionId, attachments));
  }

  /**
   * When section attachment is deleted.
   */
  onSectionAttachmentDelete = (sectionId, attachments) => {
    this.props.dispatch(deleteSectionAttachment(sectionId, attachments));
  }

  onQuestionChange = (fieldType, sectionId, questionId, optionKey, value) => {
    this.props.dispatch(editQuestion(fieldType, sectionId, questionId, optionKey, value));
  }

  onDeleteTemporaryQuestion = (sectionId, questionFrontId) => {
    this.props.dispatch(deleteTemporaryQuestion(sectionId, questionFrontId));
  }

  /**
   * Delete a question from section which has been stored in database
   */
  onDeleteExistingQuestion = (sectionId, questionFrontId) => {
    this.props.dispatch(deleteExistingQuestion(sectionId, questionFrontId));
  }

  onSectionImageChange(sectionID, field, value) {
    this.props.dispatch(changeSectionMainImage(sectionID, field, value));
  }

  onLanguagesChange = (newLanguages) => {
    this.props.dispatch(changeHearingEditorLanguages(newLanguages));
  }

  onPublish = () => {
    this.props.dispatch(publishHearing(this.props.hearing));
  }

  /**
   * Check if the hearing has all of the required properties.
   * Returns notification and highlights faulty inputs in the form if errors are found,
   * otherwise dispatch the callbackAction.
   * @param {object} hearing
   * @param {function} callbackAction
   * @returns {void|*}
   */
  validateHearing = (hearing, callbackAction) => {
    const {dispatch, hearingLanguages, intl: {formatMessage}} = this.props;
    // each key corresponds to that step in the form, ie. 1 = HearingFormStep1 etc
    const localErrors = {1: {}, 4: {}, 5: {}};

    if (validateFunction.title(hearing.title, hearingLanguages)) {
      localErrors[1].title = formatMessage({id: 'validationHearingTitle'});
    }
    if (validateFunction.labels(hearing.labels)) {
      localErrors[1].labels = formatMessage({id: 'validationHearingLabels'});
    }
    if (validateFunction.slug(hearing.slug)) {
      localErrors[1].slug = formatMessage({id: 'validationHearingSlug'});
    }
    if (validateFunction.contact_persons(hearing.contact_persons)) {
      localErrors[1].contact_persons = formatMessage({id: 'validationHearingContactPersons'});
    }
    if (validateFunction.open_at(hearing.open_at)) {
      localErrors[4].open_at = formatMessage({id: 'validationHearingOpenAt'});
    }
    if (validateFunction.close_at(hearing.close_at)) {
      localErrors[4].close_at = formatMessage({id: 'validationHearingCloseAt'});
    }
    // project is not mandatory, but if a project is given, it must have certain properties
    if (validateFunction.project(hearing.project)) {
      if (validateFunction.project_title(hearing.project.title, hearingLanguages)) {
        localErrors[5].project_title = formatMessage({id: 'validationHearingProjectTitle'});
      }
      if (validateFunction.project_phases_title(hearing.project.phases, hearingLanguages)) {
        localErrors[5].project_phase_title = formatMessage({id: 'validationHearingProjectPhaseTitle'});
      }
      if (validateFunction.project_phases_active(hearing.project.phases)) {
        localErrors[5].project_phase_active = formatMessage({id: 'validationHearingProjectPhaseActive'});
      }
    }

    // true if one of the keys in localErrors contain entries
    // eslint-disable-next-line no-unused-vars
    this.setState({errors: localErrors});
    const containsError = Object.entries(localErrors).some(([k, v]) => Object.entries(v).length > 0);
    if (!containsError) {
      return dispatch(callbackAction(hearing));
    }
    return notifyError(formatMessage({id: 'validationNotification'}));
  }

  onSaveAsCopy() {
    const {hearing} = this.props;
    this.validateHearing(hearing, saveAndPreviewNewHearing);
  }

  onSaveAndPreview() {
    const {hearing} = this.props;
    if (hearing.isNew) {
      this.validateHearing(hearing, saveAndPreviewNewHearing);
    } else {
      this.validateHearing(hearing, saveAndPreviewHearingChanges);
    }
  }

  onSaveChanges() {
    this.validateHearing(this.props.hearing, saveHearingChanges);
  }

  onUnPublish() {
    this.props.dispatch(unPublishHearing(this.props.hearing));
  }

  onCloseHearing() {
    this.props.dispatch(closeHearing(this.props.hearing));
  }

  sectionMoveUp = (sectionId) => {
    this.props.dispatch(sectionMoveUp(sectionId));
  }

  sectionMoveDown = (sectionId) => {
    this.props.dispatch(sectionMoveDown(sectionId));
  }

  onDeleteHearingDraft = () => {
    const {hearing} = this.props;
    this.props.dispatch(deleteHearingDraft(hearing.id, hearing.slug));
  }

  initSingleChoiceQuestion = (sectionId) => {
    const {dispatch} = this.props;
    dispatch(initSingleChoiceQuestion(sectionId));
  }

  initMultipleChoiceQuestion = (sectionId) => {
    const {dispatch} = this.props;
    dispatch(initMultipleChoiceQuestion(sectionId));
  }

  clearQuestions = (sectionId) => {
    const {dispatch} = this.props;
    dispatch(clearQuestions(sectionId));
  }

  addOption = (sectionId, questionId) => {
    const {dispatch} = this.props;
    dispatch(addOption(sectionId, questionId));
  }

  deleteOption = (sectionId, questionId) => {
    const {dispatch} = this.props;
    dispatch(deleteLastOption(sectionId, questionId));
  }

  getHearingForm() {
    const {contactPersons, hearing, hearingLanguages, labels, dispatch, show, language} = this.props;
    const {errors} = this.state;
    if (isEmpty(hearing)) {
      return null;
    }
    return (
      <HearingForm
        addOption={this.addOption}
        clearQuestions={this.clearQuestions}
        contactPersons={contactPersons}
        currentStep={1}
        deleteOption={this.deleteOption}
        dispatch={this.props.dispatch}
        errors={errors}
        hearing={hearing}
        hearingLanguages={hearingLanguages}
        initMultipleChoiceQuestion={this.initMultipleChoiceQuestion}
        initSingleChoiceQuestion={this.initSingleChoiceQuestion}
        labels={labels}
        language={language}
        onAddMapMarker={this.onAddMapMarker}
        onAddMapMarkersToCollection={this.onAddMapMarkersToCollection}
        onCreateMapMarker={this.onCreateMapMarker}
        onDeleteExistingQuestion={this.onDeleteExistingQuestion}
        onDeleteTemporaryQuestion={this.onDeleteTemporaryQuestion}
        onEditSectionAttachmentOrder={this.onEditSectionAttachmentOrder}
        onHearingChange={this.onHearingChange}
        onLanguagesChange={this.onLanguagesChange}
        onLeaveForm={() => dispatch(closeHearingForm())}
        onQuestionChange={this.onQuestionChange}
        onSaveAndPreview={this.onSaveAndPreview}
        onSaveChanges={this.onSaveChanges}
        onSaveAsCopy={this.onSaveAsCopy}
        onSectionAttachment={this.onSectionAttachment}
        onSectionAttachmentDelete={this.onSectionAttachmentDelete}
        onSectionAttachmentEdit={this.onSectionAttachmentEdit}
        onSectionChange={this.onSectionChange}
        onSectionImageChange={this.onSectionImageChange}
        sectionMoveDown={this.sectionMoveDown}
        sectionMoveUp={this.sectionMoveUp}
        sections={hearing.sections}
        show={show}
      />
    );
  }

  render() {
    const {hearing, isNewHearing} = this.props;
    return (
      <div className="hearing-editor">
        {this.getHearingForm()}

        {!isNewHearing &&
          <HearingToolbar
            hearing={hearing}
            onCloseHearing={this.onCloseHearing}
            onEdit={() => this.props.dispatch(startHearingEdit())}
            onPublish={this.onPublish}
            onRevertPublishing={this.onUnPublish}
            user={this.props.user}
            onDeleteHearingDraft={this.onDeleteHearingDraft}
          />
        }
      </div>
    );
  }
}

HearingEditor.propTypes = {
  contactPersons: PropTypes.arrayOf(contactShape),
  dispatch: PropTypes.func,
  show: PropTypes.bool,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(labelShape),
  user: userShape,
  language: PropTypes.string,
  isNewHearing: PropTypes.bool,
  intl: PropTypes.object,
};

export {HearingEditor as UnconnectedHearingEditor};

const WrappedHearingEditor = connect((state) => ({
  show: EditorSelector.getShowForm(state),
  language: state.language
}))(injectIntl(HearingEditor));

export default WrappedHearingEditor;
