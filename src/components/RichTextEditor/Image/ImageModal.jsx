/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { ControlLabel, HelpBlock, Image } from 'react-bootstrap';
import { Button, Dialog } from 'hds-react';
import Dropzone from 'react-dropzone';
import FormControl from 'react-bootstrap/lib/FormControl';
import { useDispatch } from 'react-redux';

import getMessage from '../../../utils/getMessage';
import { isFormValid } from '../../../utils/iframeUtils';
import Icon from '../../../utils/Icon';
import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../../utils/notify';
import { addToast } from '../../../actions/toast';

/**
 * MAX_IMAGE_SIZE given in bytes
 */
const MAX_IMAGE_SIZE = 999999;

const ImageModal = (props) => {

  const dispatch = useDispatch();

  const [showFormErrorMsg, setShowFormErrorMsg] = useState(false);
  const [fileReaderResult, setFileReaderResult] = useState(false);
  const [imageAltText, setImageAltText] = useState('');

  const resetState = () => {
    setShowFormErrorMsg(false);
    setFileReaderResult(false);
    setImageAltText('');
  }

  const onFileDrop = (files) => {
    if (files[0].size > MAX_IMAGE_SIZE) {
      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'imageSizeError')));
      return;
    }
    const file = files[0]; // Only one file is supported for now.
    const fileReader = new FileReader();
    fileReader.addEventListener(
      'load',
      () => {
        setFileReaderResult(fileReader.result);
      },
      false,
    );
    fileReader.readAsDataURL(file);
  }

  const getImagePreview = () => {
    if (fileReaderResult) {
      return <Image className='preview' src={fileReaderResult} responsive />;
    }
    return false;
  }

  const setImageAltTextFn = (event) => {
    setImageAltText(event.target.value);
  }

  const validateForm = () => {
    const inputErrors = {
      fileReaderResult: fileReaderResult ? '' : getMessage('validationCantBeEmpty'),
    };

    return isFormValid(inputErrors);
  }

  const confirmImage = () => {
    if (validateForm()) {
      props.onSubmit(fileReaderResult, imageAltText);
      resetState();
    } else {
      setShowFormErrorMsg(true);
    }
  }

  const { isOpen, intl, onClose } = props;
  const dropZoneClass = fileReaderResult ? 'dropzone preview' : 'dropzone';

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
          <Dropzone accept='image/*' multiple={false} onDrop={onFileDrop}>
            {
              ({getRootProps, getInputProps}) => (
                <>
                  {getImagePreview()}
                  <div className={dropZoneClass}>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <span className='text'>
                        <FormattedMessage id='selectOrDropImage' />
                        <Icon className='icon' name='upload' />
                      </span>
                    </div>
                  </div>
                </>
              )
            }

          </Dropzone>
          <HelpBlock>
            <FormattedMessage id='sectionImageHelpText' />
          </HelpBlock>
          <ControlLabel>
            <FormattedMessage id='sectionImageCaption' />
          </ControlLabel>
          <FormControl
            type='text'
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
}

ImageModal.propTypes = {
  isOpen: PropTypes.bool,
  intl: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default injectIntl(ImageModal);
