import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Accordion from 'react-bootstrap/lib/Accordion';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Modal from 'react-bootstrap/lib/Modal';
import Panel from 'react-bootstrap/lib/Panel';

import Step1 from './HearingFormStep1';
import Step2 from './HearingFormStep2';
import Step3 from './HearingFormStep3';
import Step4 from './HearingFormStep4';
import {hearingShape, hearingEditorMetaDataShape} from '../../types';


class HearingForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStep: parseInt(props.currentStep, 10) || 1,
    };
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.formSteps = [Step1, Step2, Step3, Step4];
  }

  setCurrentStep(step) {
    this.setState({currentStep: parseInt(step, 10)});
  }

  nextStep() {
    this.setCurrentStep(this.state.currentStep + 1);
  }

  getFormStep(stepNumber) {
    const {intl: {formatMessage}, hearing, hearingLanguages} = this.props;
    const step = stepNumber.toString();
    const title = formatMessage({id: 'hearingFormHeaderStep' + step});
    const PhaseTag = this.formSteps[stepNumber - 1];  // Zero indexed list
    const isVisible = this.state.currentStep === stepNumber;

    return (
      <Panel header={title} eventKey={step}>
        <PhaseTag
          hearing={hearing}
          hearingLanguages={hearingLanguages}
          onLanguagesChange={this.props.onLanguagesChange}
          onHearingChange={this.props.onHearingChange}
          onSectionChange={this.props.onSectionChange}
          onSectionImageChange={this.props.onSectionImageChange}
          onContinue={this.nextStep}
          visible={isVisible}
          editorMetaData={this.props.editorMetaData}
          errors={this.props.errors}
        />
      </Panel>
    );
  }

  getActions() {
    const hearing = this.props.hearing;
    if (hearing.published) {
      return (
        <Button bsStyle="primary" className="pull-right" onClick={this.props.onSaveChanges}>
          <FormattedMessage id="saveHearingChanges"/>
        </Button>
      );
    }
    return (
      <ButtonToolbar className="pull-right">
        <Button bsStyle="primary" onClick={this.props.onSaveAndPreview}>
          <FormattedMessage id="saveAndPreviewHearing"/>
        </Button>
      </ButtonToolbar>
    );
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
        backdrop
        bsSize="large"
        dialogClassName="form-modal"
        onHide={this.props.onLeaveForm}
        show={this.props.show}
      >
        {this.getErrors()}
        <form>
          <Accordion activeKey={this.state.currentStep.toString()} onSelect={this.setCurrentStep}>
            {this.getFormStep(1)}
            {this.getFormStep(2)}
            {this.getFormStep(3)}
            {this.getFormStep(4)}
          </Accordion>
          <div className="clearfix">{this.getActions()}</div>
        </form>
      </Modal>
    );
  }
}

HearingForm.propTypes = {
  currentStep: React.PropTypes.number,
  editorMetaData: hearingEditorMetaDataShape,
  errors: React.PropTypes.object,
  hearing: hearingShape,
  hearingLanguages: React.PropTypes.arrayOf(React.PropTypes.string),
  intl: intlShape.isRequired,
  onHearingChange: React.PropTypes.func,
  onLanguagesChange: React.PropTypes.func,
  onLeaveForm: React.PropTypes.func,
  onSaveAndPreview: React.PropTypes.func,
  onSaveChanges: React.PropTypes.func,
  onSectionChange: React.PropTypes.func,
  onSectionImageChange: React.PropTypes.func,
  show: React.PropTypes.bool,
};

HearingForm.defaultProps = {
  editorMetaData: {
    contacts: [],
    labels: [],
  },
};

const WrappedHearingForm = connect((state) => ({
  editorMetaData: state.hearingEditor.metaData,
  errors: state.hearingEditor.errors,
  hearingLanguages: state.hearingEditor.languages,
}), null, null, {pure: false})(injectIntl(HearingForm));

export default WrappedHearingForm;
