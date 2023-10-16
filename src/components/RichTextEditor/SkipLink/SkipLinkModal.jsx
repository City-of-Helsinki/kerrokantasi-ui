import React from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';
import { Button } from 'hds-react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import RichTextModalTextField from '../RichTextModalTextField';
import getMessage from '../../../utils/getMessage';
import { isFormValid } from './SkipLinkUtils';

const initialState = {
  linkText: '',
  linkOwnId: '',
  linkTargetId: '',
  linkIsHidden: false,
  inputErrors: {
    linkText: '',
    linkOwnId: '',
    linkTargetId: '',
  },
  showFormErrorMsg: false,
};

class SkipLinkModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.confirmSkipLink = this.confirmSkipLink.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState((state) => {
      const inputErrors = { ...state.inputErrors, ...{ [name]: '' } };
      return {
        showFormErrorMsg: false,
        [name]: value,
        inputErrors,
      };
    });
  }

  handleInputBlur(event) {
    const { target } = event;
    if (target.required && !target.value) {
      this.setState((state) => {
        const inputErrors = { ...state.inputErrors, ...{ [target.name]: getMessage('validationCantBeEmpty') } };
        return {
          inputErrors,
        };
      });
    }
  }

  validateForm() {
    const { linkText, linkOwnId, linkTargetId } = this.state;

    const inputErrors = {
      linkText: linkText ? '' : getMessage('validationCantBeEmpty'),
      linkOwnId: linkOwnId ? '' : getMessage('validationCantBeEmpty'),
      linkTargetId: linkTargetId ? '' : getMessage('validationCantBeEmpty'),
    };

    this.setState({
      inputErrors,
    });

    return isFormValid(inputErrors);
  }

  confirmSkipLink() {
    const { linkText, linkOwnId, linkTargetId, linkIsHidden } = this.state;

    if (this.validateForm()) {
      this.props.onSubmit(linkText, linkOwnId, linkTargetId, linkIsHidden);
      this.setState(initialState);
    } else {
      this.setState({
        showFormErrorMsg: true,
      });
    }
  }

  render() {
    const { isOpen, onClose } = this.props;
    const formName = 'skip-link';
    return (
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <ModalTitle componentClass='h3'>
            <FormattedMessage id='skipLinkModalTitle' />
          </ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <RichTextModalTextField
            name='linkText'
            label={getMessage('skipLinkFormFieldText')}
            handleInputChange={this.handleInputChange}
            handleInputBlur={this.handleInputBlur}
            value={this.state.linkText}
            isRequired
            errorMsg={this.state.inputErrors.linkText}
            formName={formName}
          />
          <RichTextModalTextField
            name='linkOwnId'
            label={getMessage('skipLinkFormFieldOwnId')}
            handleInputChange={this.handleInputChange}
            handleInputBlur={this.handleInputBlur}
            value={this.state.linkOwnId}
            isRequired
            errorMsg={this.state.inputErrors.linkOwnId}
            formName={formName}
          />
          <RichTextModalTextField
            name='linkTargetId'
            label={getMessage('skipLinkFormFieldTargetId')}
            handleInputChange={this.handleInputChange}
            handleInputBlur={this.handleInputBlur}
            value={this.state.linkTargetId}
            isRequired
            errorMsg={this.state.inputErrors.linkTargetId}
            formName={formName}
          />
          <label htmlFor='skip-link-is-hidden' className='rich-text-editor-form-checkbox-label'>
            {getMessage('skipLinkFormFieldHide')}
          </label>
          <input
            type='checkbox'
            id='skip-link-is-hidden'
            name='linkIsHidden'
            className='rich-text-editor-form-checkbox-input'
            checked={this.state.linkIsHidden}
            onChange={this.handleInputChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>
            <FormattedMessage id='cancel' />
          </Button>
          <Button bsStyle='primary' onClick={this.confirmSkipLink}>
            <FormattedMessage id='formButtonAcceptAndAdd' />
          </Button>
          {this.state.showFormErrorMsg && (
            <p id='skip-link-form-submit-error' role='alert' className='rich-text-editor-form-input-error'>
              {getMessage('formCheckErrors')}
            </p>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

SkipLinkModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default SkipLinkModal;
