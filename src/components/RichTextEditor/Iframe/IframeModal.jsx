import React, { useState } from 'react';
import { Button, Dialog } from 'hds-react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import IframeCopyPasteField from './IframeCopyPasteField';
import RichTextModalTextField from '../RichTextModalTextField';
import IframeSelectField from './IframeSelectField';
import {
  validateInput,
  validateForm,
  isFormValid,
} from '../../../utils/iframeUtils';
import getMessage from '../../../utils/getMessage';

const initialState = {
  title: '',
  src: '',
  width: '',
  height: '',
  scrolling: 'no',
  allow: '',
  inputErrors: {
    title: '',
    src: '',
    width: '',
    height: '',
  },
  showFormErrorMsg: false,
};

const scrollingOptions = [
  { value: 'no', text: getMessage('generalNo') },
  { value: 'yes', text: getMessage('generalYes') },
  { value: 'auto', text: 'auto' },
];

const IframeModal = ({ isOpen, onClose, onSubmit }) => {
  const intl = useIntl();
  const [state, setState] = useState(initialState);

  const handleFormSubmit = (event, fields) => {
    event.preventDefault();
    const inputErrors = validateForm(fields);
    if (isFormValid(inputErrors)) {
      onSubmit({ ...fields });
      setState(initialState);
    } else {
      setState((prev) => ({ ...prev, inputErrors, showFormErrorMsg: true }));
    }
  };

  const handleInputBlur = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    const errorMsg = validateInput(name, value);

    setState((prev) => ({
      ...prev,
      [name]: value,
      inputErrors: { ...prev.inputErrors, [name]: errorMsg },
    }));
  };

  const handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    setState((prev) => ({
      ...prev,
      showFormErrorMsg: false,
      [name]: value,
      inputErrors: { ...prev.inputErrors, [name]: '' },
    }));
  };

  const updateAttributes = (attributes) => {
    setState((prev) => ({
      ...prev,
      ...attributes,
      inputErrors: initialState.inputErrors,
      showFormErrorMsg: false,
    }));
  };

  const { inputErrors, ...fields } = state;
  const formName = 'iframe';
  const titleId = 'iframe-modal-title';
  const descriptionId = 'iframe-modal-description';

  return (
    <Dialog
      className='hearing-form-child-modal'
      isOpen={isOpen}
      close={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={intl.formatMessage({ id: 'close' })}
      theme={{ '--accent-line-color': 'var(--color-black)' }}
    >
      <Dialog.Header
        id={titleId}
        title={<FormattedMessage id='iframeModalTitle' />}
      />
      <Dialog.Content>
        <form id={descriptionId}>
          <IframeCopyPasteField updateAttributes={updateAttributes} />
          <hr />
          <RichTextModalTextField
            name='title'
            label={getMessage('iframeFormFieldTitle')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={fields.title}
            isRequired
            errorMsg={inputErrors.title}
            formName={formName}
          />
          <RichTextModalTextField
            name='src'
            label={getMessage('iframeFormFieldSrc')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={fields.src}
            isRequired
            errorMsg={inputErrors.src}
            formName={formName}
          />
          <RichTextModalTextField
            name='width'
            label={getMessage('iframeFormFieldWidth')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={fields.width}
            errorMsg={inputErrors.width}
            formName={formName}
          />
          <RichTextModalTextField
            name='height'
            label={getMessage('iframeFormFieldHeight')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={fields.height}
            errorMsg={inputErrors.height}
            formName={formName}
          />
          <RichTextModalTextField
            name='allow'
            label={getMessage('iframeFormFieldAllow')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={fields.allow}
            errorMsg={inputErrors.allow}
            formName={formName}
          />
          <IframeSelectField
            name='scrolling'
            label={getMessage('iframeFormFieldScrolling')}
            handleInputChange={handleInputChange}
            value={fields.scrolling}
            options={scrollingOptions}
          />
        </form>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button
          className='kerrokantasi-btn black'
          onClick={(event) => handleFormSubmit(event, fields)}
        >
          <FormattedMessage id='formButtonAcceptAndAdd' />
        </Button>
        <Button className='kerrokantasi-btn' onClick={() => onClose()}>
          <FormattedMessage id='cancel' />
        </Button>
        {fields.showFormErrorMsg && (
          <p
            data-testid='iframe-form-submit-error'
            id='iframe-form-submit-error'
            role='alert'
            className='rich-text-editor-form-input-error'
          >
            {getMessage('formCheckErrors')}
          </p>
        )}
      </Dialog.ActionButtons>
    </Dialog>
  );
};

IframeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default IframeModal;
