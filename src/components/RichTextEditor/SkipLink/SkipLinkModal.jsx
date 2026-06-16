import React, { useState } from 'react';
import { Button, Dialog } from 'hds-react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import RichTextModalTextField from '../RichTextModalTextField';
import getMessage from '../../../utils/getMessage';
import { isFormValid } from '../../../utils/isFormValid';

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

const SkipLinkModal = ({ isOpen, onClose, onSubmit }) => {
  const intl = useIntl();
  const [state, setState] = useState(initialState);

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

  const handleInputBlur = (event) => {
    const { target } = event;
    if (target.required && !target.value) {
      setState((prev) => ({
        ...prev,
        inputErrors: {
          ...prev.inputErrors,
          [target.name]: getMessage('validationCantBeEmpty'),
        },
      }));
    }
  };

  const validateForm = () => {
    const { linkText, linkOwnId, linkTargetId } = state;

    const inputErrors = {
      linkText: linkText ? '' : getMessage('validationCantBeEmpty'),
      linkOwnId: linkOwnId ? '' : getMessage('validationCantBeEmpty'),
      linkTargetId: linkTargetId ? '' : getMessage('validationCantBeEmpty'),
    };

    setState((prev) => ({ ...prev, inputErrors }));

    return isFormValid(inputErrors);
  };

  const confirmSkipLink = () => {
    const { linkText, linkOwnId, linkTargetId, linkIsHidden } = state;

    if (validateForm()) {
      onSubmit(linkText, linkOwnId, linkTargetId, linkIsHidden);
      setState(initialState);
    } else {
      setState((prev) => ({ ...prev, showFormErrorMsg: true }));
    }
  };

  const formName = 'skip-link';
  const titleId = 'skip-link-modal-title';
  const descriptionId = 'skip-link-modal-description';

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
        title={<FormattedMessage id='skipLinkModalTitle' />}
      />
      <Dialog.Content>
        <div id={descriptionId}>
          <RichTextModalTextField
            name='linkText'
            label={getMessage('skipLinkFormFieldText')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={state.linkText}
            isRequired
            errorMsg={state.inputErrors.linkText}
            formName={formName}
          />
          <RichTextModalTextField
            name='linkOwnId'
            label={getMessage('skipLinkFormFieldOwnId')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={state.linkOwnId}
            isRequired
            errorMsg={state.inputErrors.linkOwnId}
            formName={formName}
          />
          <RichTextModalTextField
            name='linkTargetId'
            label={getMessage('skipLinkFormFieldTargetId')}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            value={state.linkTargetId}
            isRequired
            errorMsg={state.inputErrors.linkTargetId}
            formName={formName}
          />
          <label
            htmlFor='skip-link-is-hidden'
            className='rich-text-editor-form-checkbox-label'
          >
            {getMessage('skipLinkFormFieldHide')}
          </label>
          <input
            type='checkbox'
            id='skip-link-is-hidden'
            name='linkIsHidden'
            className='rich-text-editor-form-checkbox-input'
            checked={state.linkIsHidden}
            onChange={handleInputChange}
          />
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button className='kerrokantasi-btn black' onClick={confirmSkipLink}>
          <FormattedMessage id='formButtonAcceptAndAdd' />
        </Button>
        <Button className='kerrokantasi-btn' onClick={onClose} type='button'>
          <FormattedMessage id='cancel' />
        </Button>
        {state.showFormErrorMsg && (
          <p
            data-testid='skip-link-form-submit-error'
            id='skip-link-form-submit-error'
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

SkipLinkModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default SkipLinkModal;
