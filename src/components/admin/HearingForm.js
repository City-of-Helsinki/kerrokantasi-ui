import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Accordion from 'react-bootstrap/lib/Accordion';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Panel from 'react-bootstrap/lib/Panel';
import Icon from '../../utils/Icon';

import Step1 from './HearingFormStep1';
import Step2 from './HearingFormStep2';
import Step3 from './HearingFormStep3';
import Step4 from './HearingFormStep4';
import Step5 from './HearingFormStep5';
import LoadSpinner from '../LoadSpinner';
import {
  contactShape,
  hearingShape,
  hearingEditorMetaDataShape,
  labelShape,
} from '../../types';

const ADMIN_HELP_URL = 'https://drive.google.com/open?id=1vtUNzbJNVcp7K9JPrE6XP8yTmkBLW3N3FGEsR1NbbIw';


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
    this.setState({currentStep: parseInt(step, 10)});
  }

  nextStep() {
    this.setCurrentStep(this.state.currentStep + 1);
  }

  getFormStep(stepNumber) {
    const {
      contactPersons,
      intl: {formatMessage},
      hearing,
      labels,
      hearingLanguages,
      language,
      sectionMoveUp,
      sectionMoveDown,
      addOption,
      deleteOption,
      onQuestionChange,
      onDeleteTemporaryQuestion
    } = this.props;
    const step = stepNumber.toString();
    const title = formatMessage({id: 'hearingFormHeaderStep' + step});
    const PhaseTag = this.formSteps[stepNumber - 1];  // Zero indexed list
    const isVisible = this.state.currentStep === stepNumber;
    return (
      <Panel eventKey={step}>
        <Panel.Heading>
          <Panel.Title toggle>
            {title}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <PhaseTag
              contactPersons={contactPersons}
              hearing={hearing}
              hearingLanguages={hearingLanguages}
              labels={labels}
              onLanguagesChange={this.props.onLanguagesChange}
              onHearingChange={this.props.onHearingChange}
              onSectionChange={this.props.onSectionChange}
              onSectionAttachment={this.props.onSectionAttachment}
              onSectionImageChange={this.props.onSectionImageChange}
              onContinue={this.nextStep}
              visible={isVisible}
              editorMetaData={this.props.editorMetaData}
              errors={this.props.errors}
              dispatch={this.props.dispatch}
              language={language}
              sectionMoveUp={sectionMoveUp}
              sectionMoveDown={sectionMoveDown}
              formatMessage={formatMessage}
              initSingleChoiceQuestion={this.props.initSingleChoiceQuestion}
              initMultipleChoiceQuestion={this.props.initMultipleChoiceQuestion}
              clearQuestions={this.props.clearQuestions}
              addOption={addOption}
              deleteOption={deleteOption}
              onQuestionChange={onQuestionChange}
              onDeleteTemporaryQuestion={onDeleteTemporaryQuestion}
            />
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  getActions() {
    const {hearing, isSaving} = this.props;
    let ActionButton;

    if (hearing.published) {
      ActionButton = () =>
        <Button bsStyle="success" onClick={this.props.onSaveChanges}>
          <Icon className="icon" name="check-circle-o"/>  <FormattedMessage id="saveHearingChanges"/>
        </Button>;
    } else {
      ActionButton = () =>
        <Button bsStyle="success" onClick={this.props.onSaveAndPreview}>
          <Icon className="icon" name="check-circle-o"/>  <FormattedMessage id="saveAndPreviewHearing"/>
        </Button>;
    }

    if (!isSaving) {
      return <ActionButton/>;
    }

    return <div className="pull-right"><LoadSpinner/></div>;
  }

  getErrors() {
    const errors = this.props.errors;
    if (!errors) {
      return null;
    }
    // TODO: Improve error message format
    const messages = Object.keys(errors).map((key) => <li key={key}>{key}: {JSON.stringify(errors[key])}</li>);
    return (
      <Alert bsStyle="danger">
        <h2>
          <FormattedMessage id="saveFailed"/>
        </h2>
        <FormattedMessage id="tryToFixFormErrors"/>:
        <ul>{messages}</ul>
      </Alert>
    );
  }

  render() {
    return (
      <Modal
        backdrop="static"
        bsSize="large"
        dialogClassName="form-modal"
        onHide={this.props.onLeaveForm}
        show={this.props.show}
      >
        <Modal.Header closeButton bsClass="hearing-modal-header">
          <h2><FormattedMessage id="editHearing" /></h2>
          <a
            style={{textDecoration: 'none'}}
            href={ADMIN_HELP_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button bsStyle="link">
              <FormattedMessage id="help" /> <Icon className="icon" name="external-link"/>
            </Button>
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
          <div className="editor-footer">{this.getActions()}</div>
        </form>
      </Modal>
    );
  }
}

HearingForm.propTypes = {
  contactPersons: PropTypes.arrayOf(contactShape),
  currentStep: PropTypes.number,
  dispatch: PropTypes.func,
  editorMetaData: hearingEditorMetaDataShape,
  isSaving: PropTypes.bool,
  errors: PropTypes.object,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  labels: PropTypes.arrayOf(labelShape),
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  onLeaveForm: PropTypes.func,
  onSaveAndPreview: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  show: PropTypes.bool,
  language: PropTypes.string,
  sectionMoveUp: PropTypes.func,
  sectionMoveDown: PropTypes.func,
  clearQuestions: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  initMultipleChoiceQuestion: PropTypes.func,
  addOption: PropTypes.func,
  deleteOption: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onSectionAttachment: PropTypes.func
};

const WrappedHearingForm = connect(null, null, null, {pure: false})(injectIntl(HearingForm));

export default WrappedHearingForm;
