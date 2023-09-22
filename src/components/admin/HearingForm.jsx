/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Accordion from 'react-bootstrap/lib/Accordion';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Panel from 'react-bootstrap/lib/Panel';

import Icon from '../../utils/Icon';
import config from '../../config';
import Step1 from './HearingFormStep1';
import Step2 from './HearingFormStep2';
import Step3 from './HearingFormStep3';
import Step4 from './HearingFormStep4';
import Step5 from './HearingFormStep5';
import LoadSpinner from '../LoadSpinner';
import { contactShape, hearingShape, hearingEditorMetaDataShape, labelShape, organizationShape } from '../../types';

class HearingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: parseInt(props.currentStep, 10) || 1,
    };
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.formSteps = [Step1, Step2, Step3, Step4, Step5];
  }

  setCurrentStep(step) {
    this.setState({ currentStep: parseInt(step, 10) });
  }

  getFormStep(stepNumber) {
    const {
      contactPersons,
      organizations,
      intl: { formatMessage },
      hearing,
      labels,
      hearingLanguages,
      language,
      sectionMoveUp,
      sectionMoveDown,
      addOption,
      deleteOption,
      onQuestionChange,
      onDeleteTemporaryQuestion,
      errors,
    } = this.props;

    const step = stepNumber.toString();
    let title = formatMessage({ id: `hearingFormHeaderStep${step}` });
    const stepErrors = errors[stepNumber] || {};
    if (errors[stepNumber] && Object.keys(errors[stepNumber]).length > 0) {
      title += formatMessage({ id: 'hearingFormHeaderContainsErrors' });
    }
    const PhaseTag = this.formSteps[stepNumber - 1]; // Zero indexed list
    const isVisible = this.state.currentStep === stepNumber;
    return (
      <Panel eventKey={step}>
        <Panel.Heading>
          <Panel.Title toggle>{title}</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <PhaseTag
              addOption={addOption}
              clearQuestions={this.props.clearQuestions}
              contactPersons={contactPersons}
              organizations={organizations}
              deleteOption={deleteOption}
              dispatch={this.props.dispatch}
              editorMetaData={this.props.editorMetaData}
              errors={stepErrors}
              formatMessage={formatMessage}
              hearing={hearing}
              hearingLanguages={hearingLanguages}
              initMultipleChoiceQuestion={this.props.initMultipleChoiceQuestion}
              initSingleChoiceQuestion={this.props.initSingleChoiceQuestion}
              labels={labels}
              language={language}
              onContinue={this.nextStep}
              onAddMapMarker={this.props.onAddMapMarker}
              onAddMapMarkersToCollection={this.props.onAddMapMarkersToCollection}
              onCreateMapMarker={this.props.onCreateMapMarker}
              onDeleteExistingQuestion={this.props.onDeleteExistingQuestion}
              onDeleteTemporaryQuestion={onDeleteTemporaryQuestion}
              onEditSectionAttachmentOrder={this.props.onEditSectionAttachmentOrder}
              onHearingChange={this.props.onHearingChange}
              onLanguagesChange={this.props.onLanguagesChange}
              onQuestionChange={onQuestionChange}
              onSectionAttachment={this.props.onSectionAttachment}
              onSectionAttachmentDelete={this.props.onSectionAttachmentDelete}
              onSectionAttachmentEdit={this.props.onSectionAttachmentEdit}
              onSectionChange={this.props.onSectionChange}
              onSectionImageChange={this.props.onSectionImageChange}
              sectionMoveDown={sectionMoveDown}
              sectionMoveUp={sectionMoveUp}
              visible={isVisible}
            />
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  getActions() {
    const { hearing, isSaving, onSaveChanges, onSaveAsCopy, onSaveAndPreview } = this.props;
    let ActionButton;

    if (hearing.published) {
      ActionButton = () => (
        <div className='flex-end btn-toolbar'>
          <Button bsStyle='success' onClick={onSaveAsCopy}>
            <Icon name='copy' /> <FormattedMessage id='copyHearing' />
          </Button>
          <Button bsStyle='success' onClick={onSaveChanges}>
            <Icon className='icon' name='check-circle-o' /> <FormattedMessage id='saveHearingChanges' />
          </Button>
        </div>
      );
    } else {
      ActionButton = () => (
        <Button bsStyle='success' onClick={onSaveAndPreview}>
          <Icon className='icon' name='check-circle-o' /> <FormattedMessage id='saveAndPreviewHearing' />
        </Button>
      );
    }

    if (!isSaving) {
      return <ActionButton />;
    }

    return (
      <div className='pull-right'>
        <LoadSpinner />
      </div>
    );
  }

  getErrors() {
    const {
      errors,
      intl: { formatMessage },
    } = this.props;
    if (!errors || !Object.keys(errors).some((key) => Object.keys(errors[key]).length > 0)) {
      return null;
    }
    /**
     * Iterates through each key in the errors object and if they contain keys we iterate through those keys.
     *
     * Push a list element with text from each specific inner value and we end up with a list for each
     * key ie. title/slug that contains a ul with each value listed.
     * @example
     * {1: {title: 'Fill in title', slug: 'Fill in address'},
     * 4: {},
     * 5: {project_title: 'Fill in project title'}
     * }
     * <li>hearingFormHeaderStep1
     * <ul><li>'Fill in title'</li><li>'Fill in address'</li></ul>
     * </li>
     * <li>hearingFormHeaderStep5
     * <ul><li>'Fill in project title'</li></ul>
     * </li>
     */
    const messages = Object.keys(errors).reduce((rootAccumulator, currentRootValue) => {
      if (Object.keys(errors[currentRootValue]).length > 0) {
        const subErrors = Object.keys(errors[currentRootValue]).reduce((accumulator, currentValue) => {
          accumulator.push(<li key={currentValue}>{errors[currentRootValue][currentValue]}</li>);
          return accumulator;
        }, []);
        rootAccumulator.push(
          <li key={currentRootValue}>
            {formatMessage({ id: `hearingFormHeaderStep${currentRootValue}` })}
            <ul>{subErrors}</ul>
          </li>,
        );
      }
      return rootAccumulator;
    }, []);
    return (
      <Alert bsStyle='danger'>
        <FormattedMessage id='saveFailed'>{(txt) => <h2>{txt}</h2>}</FormattedMessage>
        <FormattedMessage id='tryToFixFormErrors'>{(txt) => <p>{txt}:</p>}</FormattedMessage>
        <ul>{messages}</ul>
      </Alert>
    );
  }

  nextStep() {
    this.setCurrentStep(this.state.currentStep + 1);
  }

  render() {
    return (
      <Modal
        backdrop='static'
        bsSize='large'
        dialogClassName='form-modal'
        onHide={this.props.onLeaveForm}
        show={this.props.show}
      >
        <Modal.Header closeButton bsClass='hearing-modal-header'>
          <h2>
            <FormattedMessage id='editHearing' />
          </h2>
          <a style={{ lineHeight: 2 }} href={config.adminHelpUrl} rel='noopener noreferrer' target='_blank'>
            <FormattedMessage id='help' />
          </a>
        </Modal.Header>
        {this.getErrors()}
        <form>
          <Accordion activeKey={this.state.currentStep.toString()} onSelect={this.setCurrentStep}>
            {this.getFormStep(1)}
            {this.getFormStep(2)}
            {this.getFormStep(3)}
            {this.getFormStep(4)}
            {this.getFormStep(5)}
          </Accordion>
          <div className='editor-footer'>{this.getActions()}</div>
        </form>
      </Modal>
    );
  }
}

HearingForm.propTypes = {
  addOption: PropTypes.func,
  clearQuestions: PropTypes.func,
  contactPersons: PropTypes.arrayOf(contactShape),
  organizations: PropTypes.arrayOf(organizationShape),
  currentStep: PropTypes.number,
  deleteOption: PropTypes.func,
  dispatch: PropTypes.func,
  editorMetaData: hearingEditorMetaDataShape,
  errors: PropTypes.object,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  initMultipleChoiceQuestion: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  intl: intlShape.isRequired,
  isSaving: PropTypes.bool,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  onAddMapMarker: PropTypes.func,
  onAddMapMarkersToCollection: PropTypes.func,
  onCreateMapMarker: PropTypes.func,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onEditSectionAttachmentOrder: PropTypes.func,
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  onLeaveForm: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSaveAndPreview: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onSaveAsCopy: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  onSectionAttachmentDelete: PropTypes.func,
  onSectionAttachmentEdit: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  sectionMoveDown: PropTypes.func,
  sectionMoveUp: PropTypes.func,
  show: PropTypes.bool,
};

const WrappedHearingForm = connect(null, null, null, { pure: false })(injectIntl(HearingForm));

export default WrappedHearingForm;
