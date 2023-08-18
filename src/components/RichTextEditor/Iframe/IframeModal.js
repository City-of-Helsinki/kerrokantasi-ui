/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react';
import {Modal, Button, ModalTitle } from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import IframeCopyPasteField from './IframeCopyPasteField';
import RichTextModalTextField from '../RichTextModalTextField';
import IframeSelectField from './IframeSelectField';
import {validateInput, validateForm, isFormValid} from './IframeUtils';
import getMessage from '../../../utils/getMessage';


const initialState = {
  title: '', // required for accessibility
  src: '', // valid url
  width: '', // number
  height: '', // number
  scrolling: 'no', // should be no, yes or auto
  allow: '', // string of iframe's security settings etc
  inputErrors: {
    title: '',
    src: '',
    width: '',
    height: '',
  },
  showFormErrorMsg: false,
};

const scrollingOptions = [
  {value: "no", text: getMessage('generalNo')},
  {value: "yes", text: getMessage('generalYes')},
  {value: "auto", text: 'auto'},
];

class IframeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.updateAttributes = this.updateAttributes.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // expects data to be parsed attribute values for iframe
  updateAttributes(attributes) {
    this.setState({
      ...attributes,
      inputErrors: initialState.inputErrors,
      showFormErrorMsg: false,
    });
  }

  handleInputChange(event) {
    const {target} = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const {name} = target;

    this.setState((state) => {
      const inputErrors = {...state.inputErrors, ...{[name]: ''}};
      return ({
        showFormErrorMsg: false,
        [name]: value,
        inputErrors,
      });
    });
  }

  handleInputBlur(event) {
    const {target} = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const {name} = target;
    const errorMsg = validateInput(name, value);

    this.setState((state) => {
      const inputErrors = {...state.inputErrors, ...{[name]: errorMsg}};
      return ({
        [name]: value,
        inputErrors,
      });
    });
  }

  handleFormSubmit(event, fields) {
    event.preventDefault();
    const inputErrors = validateForm(fields);
    if (isFormValid(inputErrors)) {
      this.props.onSubmit({...fields});
      this.setState(initialState);
    } else {
      this.setState({inputErrors, showFormErrorMsg: true});
    }
  }

  render() {
    const { isOpen, onClose } = this.props;
    const {inputErrors, ...fields} = this.state;
    const formName = "iframe";

    return (
      <Modal show={isOpen} onHide={() => onClose()}>
        <Modal.Header closeButton>
          <ModalTitle componentClass="h3">
            {<FormattedMessage id="iframeModalTitle"/>}
          </ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <form ref={(form) => { this.iframeForm = form; }} onSubmit={this.submitForm}>
            <IframeCopyPasteField updateAttributes={this.updateAttributes} />
            <hr />
            <RichTextModalTextField
              name="title"
              label={getMessage('iframeFormFieldTitle')}
              handleInputChange={this.handleInputChange}
              handleInputBlur={this.handleInputBlur}
              value={this.state.title}
              isRequired
              errorMsg={this.state.inputErrors.title}
              formName={formName}
            />
            <RichTextModalTextField
              name="src"
              label={getMessage('iframeFormFieldSrc')}
              handleInputChange={this.handleInputChange}
              handleInputBlur={this.handleInputBlur}
              value={this.state.src}
              isRequired
              errorMsg={this.state.inputErrors.src}
              formName={formName}
            />
            <RichTextModalTextField
              name="width"
              label={getMessage('iframeFormFieldWidth')}
              handleInputChange={this.handleInputChange}
              handleInputBlur={this.handleInputBlur}
              value={this.state.width}
              errorMsg={this.state.inputErrors.width}
              formName={formName}
            />
            <RichTextModalTextField
              name="height"
              label={getMessage('iframeFormFieldHeight')}
              handleInputChange={this.handleInputChange}
              handleInputBlur={this.handleInputBlur}
              value={this.state.height}
              errorMsg={this.state.inputErrors.height}
              formName={formName}
            />
            <RichTextModalTextField
              name="allow"
              label={getMessage('iframeFormFieldAllow')}
              handleInputChange={this.handleInputChange}
              handleInputBlur={this.handleInputBlur}
              value={this.state.allow}
              errorMsg={this.state.inputErrors.allow}
              formName={formName}
            />
            <IframeSelectField
              name="scrolling"
              label={getMessage('iframeFormFieldScrolling')}
              handleInputChange={this.handleInputChange}
              value={this.state.scrolling}
              options={scrollingOptions}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onClose()}>
            <FormattedMessage id="cancel"/>
          </Button>
          <Button
            bsStyle="primary"
            onClick={(event) => this.handleFormSubmit(event, fields)}
          >
            { <FormattedMessage id="formButtonAcceptAndAdd" /> }
          </Button>
          {this.state.showFormErrorMsg &&
            <p id="iframe-form-submit-error" role="alert" className="rich-text-editor-form-input-error">
              {getMessage('formCheckErrors')}
            </p>}
        </Modal.Footer>
      </Modal>
    );
  }
}

IframeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default IframeModal;
