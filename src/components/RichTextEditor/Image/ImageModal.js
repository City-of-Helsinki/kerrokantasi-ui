/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import getMessage from '../../../utils/getMessage';
import {isFormValid} from '../Iframe/IframeUtils';
import {
  ControlLabel,
  HelpBlock,
  Image,
  Modal,
  Button,
  ModalTitle
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import Icon from '../../../utils/Icon';
import {localizedNotifyError} from '../../../utils/notify';

const initialState = {
  showFormErrorMsg: false,
  fileReaderResult: false
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
  }

  validateForm() {
    const {fileReaderResult} = this.state;

    const inputErrors = {
      fileReaderResult: fileReaderResult ? '' : getMessage('validationCantBeEmpty'),
    };

    return isFormValid(inputErrors);
  }


  confirmImage() {
    const {fileReaderResult} = this.state;

    if (this.validateForm()) {
      this.props.onSubmit(fileReaderResult);
      this.setState(initialState);
    } else {
      this.setState({
        showFormErrorMsg: true,
      });
    }
  }

  onFileDrop(files) {
    if (files[0].size > MAX_IMAGE_SIZE) {
      localizedNotifyError('imageSizeError');
      return;
    }
    const file = files[0];  // Only one file is supported for now.
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      this.setState({fileReaderResult: fileReader.result});
    }, false);
    fileReader.readAsDataURL(file);
  }

  getImagePreview() {
    if (this.state.fileReaderResult) {
      return (<Image className="preview" src={this.state.fileReaderResult} responsive />);
    }
    return false;
  }

  render() {
    const { isOpen, onClose } = this.props;
    const dropZoneClass = this.state.fileReaderResult ? "dropzone preview" : "dropzone";
    return (
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <ModalTitle componentClass="h3">
            {<FormattedMessage id="imageModalTitle"/>}
          </ModalTitle>
        </Modal.Header>
        <Modal.Body className="form-modal image-modal">
          <div className="form-group">
            <ControlLabel><FormattedMessage id="sectionImage"/></ControlLabel>
            <Dropzone
              accept="image/*"
              className={dropZoneClass}
              multiple={false}
              onDrop={this.onFileDrop}
            >
              {this.getImagePreview()}
              <div className="overlay">
                <span className="text">
                  <FormattedMessage id="selectOrDropImage"/>
                  <Icon className="icon" name="upload"/>
                </span>
              </div>
            </Dropzone>
            <HelpBlock><FormattedMessage id="sectionImageHelpText"/></HelpBlock>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>
            <FormattedMessage id="cancel"/>
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.confirmImage}
          >
            { <FormattedMessage id="formButtonAcceptAndAdd" /> }
          </Button>
          {this.state.showFormErrorMsg &&
            <p id="skip-link-form-submit-error" role="alert" className="rich-text-editor-form-input-error">
              {getMessage('formCheckErrors')}
            </p>}
        </Modal.Footer>
      </Modal>
    );
  }
}

ImageModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ImageModal;
