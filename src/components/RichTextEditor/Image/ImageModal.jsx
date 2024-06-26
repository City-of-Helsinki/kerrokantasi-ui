import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { ControlLabel, HelpBlock, Image } from 'react-bootstrap';
import { Button, Dialog } from 'hds-react';
import Dropzone from 'react-dropzone';
import FormControl from 'react-bootstrap/lib/FormControl';

import getMessage from '../../../utils/getMessage';
import { isFormValid } from '../../../utils/iframeUtils';
import Icon from '../../../utils/Icon';
import { localizedNotifyError } from '../../../utils/notify';

const initialState = {
  showFormErrorMsg: false,
  fileReaderResult: false,
  imageAltText: '',
};

/**
 * MAX_IMAGE_SIZE given in bytes
 */
const MAX_IMAGE_SIZE = 999999;

class ImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.onFileDrop = this.onFileDrop.bind(this);
    this.getImagePreview = this.getImagePreview.bind(this);
    this.confirmImage = this.confirmImage.bind(this);
    this.setImageAltText = this.setImageAltText.bind(this);
  }

  onFileDrop(files) {
    if (files[0].size > MAX_IMAGE_SIZE) {
      localizedNotifyError('imageSizeError');
      return;
    }
    const file = files[0]; // Only one file is supported for now.
    const fileReader = new FileReader();
    fileReader.addEventListener(
      'load',
      () => {
        this.setState({ fileReaderResult: fileReader.result });
      },
      false,
    );
    fileReader.readAsDataURL(file);
  }

  getImagePreview() {
    if (this.state.fileReaderResult) {
      return <Image className='preview' src={this.state.fileReaderResult} responsive />;
    }
    return false;
  }

  setImageAltText(event) {
    this.setState({ imageAltText: event.target.value });
  }

  confirmImage() {
    const { fileReaderResult, imageAltText } = this.state;
    if (this.validateForm()) {
      this.props.onSubmit(fileReaderResult, imageAltText);
      this.setState(initialState);
    } else {
      this.setState({
        showFormErrorMsg: true,
      });
    }
  }

  validateForm() {
    const { fileReaderResult } = this.state;

    const inputErrors = {
      fileReaderResult: fileReaderResult ? '' : getMessage('validationCantBeEmpty'),
    };

    return isFormValid(inputErrors);
  }

  render() {
    const { isOpen, intl, onClose } = this.props;
    const dropZoneClass = this.state.fileReaderResult ? 'dropzone preview' : 'dropzone';

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
            <Dropzone accept='image/*' className={dropZoneClass} multiple={false} onDrop={this.onFileDrop}>
              {this.getImagePreview()}
              <div className='overlay'>
                <span className='text'>
                  <FormattedMessage id='selectOrDropImage' />
                  <Icon className='icon' name='upload' />
                </span>
              </div>
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
              value={this.state.imageAltText}
              onChange={this.setImageAltText}
            />
          </div>
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button className='kerrokantasi-btn' onClick={onClose}>
            <FormattedMessage id='cancel' />
          </Button>
          <Button className='kerrokantasi-btn black' onClick={this.confirmImage}>
            <FormattedMessage id='formButtonAcceptAndAdd' />
          </Button>
          {this.state.showFormErrorMsg && (
            <p id='skip-link-form-submit-error' role='alert' className='rich-text-editor-form-input-error'>
              {getMessage('formCheckErrors')}
            </p>
          )}
        </Dialog.ActionButtons>
      </Dialog>
    );
  }
}

ImageModal.propTypes = {
  isOpen: PropTypes.bool,
  intl: intlShape.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default injectIntl(ImageModal);
