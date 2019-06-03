import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {isEmpty, values} from 'lodash';
import {notifyError} from '../../utils/notify';
import {
  addOption,
  addSectionAttachment,
  changeHearing,
  changeHearingEditorLanguages,
  changeSection,
  changeSectionMainImage,
  clearQuestions,
  closeHearing,
  closeHearingForm,
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


class HearingEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onCloseHearing = this.onCloseHearing.bind(this);
    this.onHearingChange = this.onHearingChange.bind(this);
    this.onLanguagesChange = this.onLanguagesChange.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.onSaveAndPreview = this.onSaveAndPreview.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onSectionChange = this.onSectionChange.bind(this);
    this.onSectionImageChange = this.onSectionImageChange.bind(this);
    this.onUnPublish = this.onUnPublish.bind(this);
  }

  onHearingChange = (field, value) => {
    this.props.dispatch(changeHearing(field, value));
  }

  onSectionChange = (sectionID, field, value) => {
    this.props.dispatch(changeSection(sectionID, field, value));
  }

  /**
   * Add a new attachement to a section.
   * The upload happens as soon as user selects a file to upload.
   */
  onSectionAttachment = (sectionId, attachements, attachmentProperties) => {
    this.props.dispatch(addSectionAttachment(sectionId, attachements, attachmentProperties));
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
  onSectionAttachmentEdit = (sectionId, attachement) => {
    this.props.dispatch(editSectionAttachment(sectionId, attachement));
  }

  /**
   * When section attachment is deleted.
   */
  onSectionAttachmentDelete = (sectionId, attachement) => {
    this.props.dispatch(deleteSectionAttachment(sectionId, attachement));
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

  // Check if the hearing has all the required properties. Returns with error message to user if not, else dispatches and action as a callback.
  validateHearing = (hearing, callbackAction) => {
    const {dispatch} = this.props;

    if (isEmpty(hearing.title) || values(hearing.title).filter((value) => value !== '').length <= 0) {
      return notifyError('Aseta otsikko ennen tallentamista.');
    }
    if (isEmpty(hearing.labels)) {
      return notifyError('Aseta ainakin yksi asiasana.');
    }

    // project is not mandatory, but if a project is given, it must have certain properties
    if (!isEmpty(hearing.project)) {
      if (isEmpty(hearing.project.title) || values(hearing.project.title).filter((value) => value === '').length > 0) {
        return notifyError('Aseta projektin nimi ennen tallennusta.');
      }
      if (hearing.project.phases.filter(
        phase => isEmpty(phase.title) || values(phase.title).filter((value) => value === '').length > 0).length > 0) {
        return notifyError('Aseta vaiheen otsikko ennen tallennusta.');
      }
      if (hearing.project.phases.filter(phase => phase.is_active).length <= 0) {
        return notifyError('Prosessit tarvitsevat ainakin yhden aktiivisen vaiheen.');
      }
    }
    if (hearing.slug === '') {
      return notifyError('Aseta osoite ennen tallentamista.');
    }
    if (isEmpty(hearing.contact_persons)) {
      return notifyError('Aseta ainakin yksi yhteyshenkilö.');
    }
    if (!hearing.open_at) {
      return notifyError('Aseta avautumisaika ennen tallentamista.');
    }
    if (!hearing.close_at) {
      return notifyError('Aseta sulkeutumisaika ennen tallentamista.');
    }
    return dispatch(callbackAction(hearing));
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
        hearing={hearing}
        hearingLanguages={hearingLanguages}
        initMultipleChoiceQuestion={this.initMultipleChoiceQuestion}
        initSingleChoiceQuestion={this.initSingleChoiceQuestion}
        labels={labels}
        language={language}
        onDeleteExistingQuestion={this.onDeleteExistingQuestion}
        onDeleteTemporaryQuestion={this.onDeleteTemporaryQuestion}
        onEditSectionAttachmentOrder={this.onEditSectionAttachmentOrder}
        onHearingChange={this.onHearingChange}
        onLanguagesChange={this.onLanguagesChange}
        onLeaveForm={() => dispatch(closeHearingForm())}
        onQuestionChange={this.onQuestionChange}
        onSaveAndPreview={this.onSaveAndPreview}
        onSaveChanges={this.onSaveChanges}
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
};

const WrappedHearingEditor = connect((state) => ({
  show: EditorSelector.getShowForm(state),
  language: state.language
}))(injectIntl(HearingEditor));

export default WrappedHearingEditor;
