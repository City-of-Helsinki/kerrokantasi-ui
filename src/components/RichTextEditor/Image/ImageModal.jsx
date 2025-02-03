/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { ControlLabel } from 'react-bootstrap';
import { Button, Card, Dialog, FileInput, TextInput } from 'hds-react';

import getMessage from '../../../utils/getMessage';
import { isFormValid } from '../../../utils/iframeUtils';
import compressFile from '../../../utils/images/compressFile';
import fileToDataUri from '../../../utils/images/fileToDataUri';

/**
 * MAX_IMAGE_SIZE given in bytes
 */
const MAX_IMAGE_SIZE = 1;

const ImageModal = ({ isOpen, onClose, onSubmit }) => {
  const intl = useIntl();

  const [showFormErrorMsg, setShowFormErrorMsg] = useState(false);
  const [fileReaderResult, setFileReaderResult] = useState(false);
  const [imageAltText, setImageAltText] = useState('');

  const resetState = () => {
    setShowFormErrorMsg(false);
    setFileReaderResult(false);
    setImageAltText('');
  };

  const onFileChange = async (files) => {
    try {
      const file = files[0];

      const compressed = await compressFile(file, MAX_IMAGE_SIZE, 'image/webp');
      const blob = await fileToDataUri(compressed);

      setFileReaderResult(blob);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const setImageAltTextFn = (event) => {
    setImageAltText(event.target.value);
  };

  const validateForm = () => {
    const inputErrors = {
      fileReaderResult: fileReaderResult ? '' : getMessage('validationCantBeEmpty'),
    };

    return isFormValid(inputErrors);
  };

  const confirmImage = () => {
    if (validateForm()) {
      onSubmit(fileReaderResult, imageAltText);
      resetState();
    } else {
      setShowFormErrorMsg(true);
    }
  };

  const titleId = 'image-modal-title';
  const descriptionId = 'image-modal-description';

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
      <Dialog.Header id={titleId} title={<FormattedMessage id='imageModalTitle' />} />
      <Dialog.Content>
        <div id={descriptionId} className='form-container image-modal form-group'>
          <ControlLabel>
            <FormattedMessage id='sectionImage' />
          </ControlLabel>
          <div style={{ marginBottom: 'var(--spacing-s)' }}>
            {fileReaderResult && (
              <Card
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-s)',
                }}
              >
                <img style={{ maxWidth: '100%', height: 'auto' }} src={fileReaderResult} alt='' />
              </Card>
            )}
            <FileInput
              id='image-modal-add-image'
              name='image-modal-add-image'
              accept='.jpeg,.jpg,.png,.webp,.gif'
              dragAndDrop
              label={<FormattedMessage id='selectOrDropImage' />}
              helperText={<FormattedMessage id='sectionImageHelpText' />}
              language={intl.locale}
              onChange={onFileChange}
            />
          </div>
          <TextInput
            id='sectionImageCaptionInput'
            name='sectionImageCaptionInput'
            label={<FormattedMessage id='sectionImageCaption' />}
            className='sectionImageCaptionInput'
            value={imageAltText}
            onChange={setImageAltTextFn}
          />
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button className='kerrokantasi-btn black' onClick={confirmImage}>
          <FormattedMessage id='formButtonAcceptAndAdd' />
        </Button>
        <Button className='kerrokantasi-btn' onClick={onClose}>
          <FormattedMessage id='cancel' />
        </Button>
        {showFormErrorMsg && (
          <p id='skip-link-form-submit-error' role='alert' className='rich-text-editor-form-input-error'>
            {getMessage('formCheckErrors')}
          </p>
        )}
      </Dialog.ActionButtons>
    </Dialog>
  );
};

ImageModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ImageModal;
