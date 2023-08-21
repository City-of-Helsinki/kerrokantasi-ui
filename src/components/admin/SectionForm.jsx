/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { ControlLabel, FormControl, FormGroup, HelpBlock, Image, Button, ButtonGroup, Checkbox } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { isFirefox, isSafari, browserVersion } from 'react-device-detect';

import { QuestionForm } from './QuestionForm';
import Icon from '../../utils/Icon';
import { localizedNotifyError, notifyError } from '../../utils/notify';
import SectionAttachmentEditor from './SectionAttachmentEditor';
import MultiLanguageTextField, { TextFieldTypes } from '../forms/MultiLanguageTextField';
import { sectionShape } from '../../types';
import { isSpecialSectionType } from '../../utils/section';
import config from '../../config';

/**
 * MAX_IMAGE_SIZE given in bytes
 * MAX_FILE_SIZE given in MB
 */
const MAX_IMAGE_SIZE = 999999;
const MAX_FILE_SIZE = 70;

/**
 * Compares given blob to initFileSize and calls changeFunc if it's smaller than the original image file.
 * @param {Blob | Object} blob Webp Blob
 * @param {number} initFileSize original image file size.
 * @param {Object} section section that the image is added to.
 * @param {Function} changeFunc dispatch function
 * @param {Blob} initImage originally uploaded image blob.
 */
function webpConvert(blob, initFileSize, section, changeFunc, initImage) {
  const isLegacyFF = isFirefox && Number.parseInt(browserVersion, 10) < 96;
  let finalBlob = blob;
  // FF versions < 96 & Safari don't support toBlob type image/webp so a temporary webp file is created and used.
  if (isLegacyFF || isSafari) {
    finalBlob = new File([blob], 'file', {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  }
  // if the webp file is smaller than the original file -> use webp file.
  if (initFileSize > finalBlob.size) {
    const canvasReader = new FileReader();
    canvasReader.onload = () => {
      changeFunc(section.frontId, 'image', canvasReader.result);
    };
    canvasReader.readAsDataURL(finalBlob);
  } else {
    changeFunc(section.frontId, 'image', initImage);
  }
}

class SectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSectionContentChange = this.onSectionContentChange.bind(this);
    this.toggleEnableCommentMap = this.toggleEnableCommentMap.bind(this);
    this.state = {
      enabledCommentMap: false,
    };
  }

  componentDidMount() {
    const { section } = this.props;
    if (section.commenting_map_tools !== 'none') {
      this.setState({ enabledCommentMap: true });
    }
  }

  /**
   * Modify section state and propagate necessary information
   * up to the parent components.
   * @param  {object} event OnClick event
   */
  onChange(event) {
    // Propagate interesting changes to parent components
    const { name: field, value } = event.target;
    const { section } = this.props;
    switch (field) {
      case 'imageCaption':
        this.props.onSectionImageChange(section.frontId, 'caption', value);
        break;
      case 'commenting_map_tools':
        this.props.onSectionChange(section.frontId, field, value);
        break;
      default:
        this.props.onSectionChange(section.frontId, field, value);
    }
  }

  onFileDrop(files) {
    const { onSectionImageChange, section } = this.props;
    if (files[0].size > MAX_IMAGE_SIZE) {
      localizedNotifyError('imageSizeError');
      return;
    }
    if (!onSectionImageChange) {
      localizedNotifyError('imageGenericError');
      return;
    }

    const file = files[0]; // Only one file is supported for now.
    const fileReader = new FileReader();
    fileReader.addEventListener('error', () => {
      localizedNotifyError('imageFileUploadError');
    });
    fileReader.addEventListener(
      'load',
      (event) => {
        // New img element is created with the uploaded image.
        const img = document.createElement('img');
        img.src = event.target.result;
        img.onerror = () => {
          localizedNotifyError('imageFileUploadError');
        };
        img.onload = () => {
          // Canvas element is created with content from the new img.
          const canvasElement = document.createElement('canvas');
          canvasElement.width = img.width;
          canvasElement.height = img.height;

          const ctx = canvasElement.getContext('2d');
          ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
          ctx.canvas.toBlob(
            (blob) => {
              // canvas webp image Blob is passed onwards.
              webpConvert(blob, file.size, section, onSectionImageChange, fileReader.result);
            },
            'image/webp',
            0.8,
          );
        };
      },
      false,
    );
    fileReader.readAsDataURL(file);
  }

  /**
   * when attachment is dropped on the dropzone field.
   * @param {File} attachment - file to upload.
   */
  onAttachmentDrop = (attachment) => {
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1000 * 1000;
    if (attachment[0].size > MAX_FILE_SIZE_BYTES) {
      const localizedErrorMessage = (
        <FormattedMessage id='fileSizeError' values={{ n: MAX_FILE_SIZE.toString() }}>
          {(text) => text}
        </FormattedMessage>
      );
      notifyError(localizedErrorMessage);
      return;
    }
    // Load the file and then upload it.
    const { section } = this.props;
    const file = attachment[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      if (this.props.onSectionAttachment) {
        this.props.onSectionAttachment(section.frontId, fileReader.result, { [this.context.language]: file.name });
      }
    });
    fileReader.readAsDataURL(file);
  };

  onSectionContentChange(value) {
    const { onSectionChange, section } = this.props;
    onSectionChange(section.frontId, 'content', value);
  }

  getImagePreview() {
    if (this.getImage()) {
      return <Image className='preview' src={this.getImage()} responsive />;
    }
    return false;
  }

  getImage() {
    const { images } = this.props.section;
    if (images && images.length) {
      // Image property may contain the base64 encoded image
      return images[0].image || images[0].url;
    }
    return '';
  }

  static getImageCaption(section) {
    return get(section.images, '[0].caption', {});
  }

  /**
   * When there are attachments inside a section.
   * Return existing attachments.
   * @param {Object} section - the section we are editing.
   * @returns {JS<Component>} react component for displaying attachments.
   */
  renderAttachments = (section) => {
    const { files } = section;
    if (files && files.length > 0) {
      return (
        <div className='section-attachment-editor-container'>
          <ControlLabel>
            <FormattedMessage id='attachmentName' />
          </ControlLabel>
          {files.map((file, index) => {
            const fileIndex = index + 1;
            return (
              <SectionAttachmentEditor
                file={{ ...file, ordering: file.ordering ? file.ordering : fileIndex }}
                key={`file-${file.url}`}
                language={this.context.language}
                fileCount={files.length}
                section={section}
                onEditSectionAttachmentOrder={this.props.onEditSectionAttachmentOrder}
                onSectionAttachmentDelete={this.props.onSectionAttachmentDelete}
                onSectionAttachmentEdit={this.props.onSectionAttachmentEdit}
              />
            );
          })}
        </div>
      );
    }
    return null;
  };

  toggleEnableCommentMap() {
    this.setState((prevState) => ({ enabledCommentMap: !prevState.enabledCommentMap }));
    if (this.state.enabledCommentMap) {
      this.onChange({ target: { name: 'commenting_map_tools', value: 'none' } });
    }
  }

  render() {
    const {
      addOption,
      deleteOption,
      isFirstSubsection,
      isLastSubsection,
      isPublic,
      onDeleteExistingQuestion,
      onDeleteTemporaryQuestion,
      onQuestionChange,
      onSectionChange,
      onSectionImageChange,
      section,
      sectionLanguages,
      sectionMoveDown,
      sectionMoveUp,
    } = this.props;
    const { language } = this.context;
    const imageCaption = SectionForm.getImageCaption(section, language);
    const dropZoneClass = this.getImage() ? 'dropzone preview' : 'dropzone';
    const { formatMessage } = this.props.intl;

    return (
      <div className='form-step'>
        {section.type !== 'closure-info' && section.type !== 'main' && (
          <div className='section-toolbar'>
            <ButtonGroup bsSize='small'>
              <Button
                bsStyle='default'
                className='btn'
                type='button'
                onClick={() => sectionMoveUp(section.frontId)}
                disabled={isFirstSubsection}
                style={{ marginRight: '10px' }}
              >
                &uarr; <FormattedMessage id='moveUp' />
              </Button>
              <Button
                bsStyle='default'
                className='btn'
                type='button'
                onClick={() => sectionMoveDown(section.frontId)}
                disabled={isLastSubsection}
              >
                <FormattedMessage id='moveDown' /> &darr;
              </Button>
            </ButtonGroup>
          </div>
        )}
        <FormGroup controlId='image'>
          {!isSpecialSectionType(section.type) ? (
            <MultiLanguageTextField
              labelId='sectionTitle'
              name='title'
              onBlur={(value) => onSectionChange(section.frontId, 'title', value)}
              value={section.title}
              languages={sectionLanguages}
              placeholderId='sectionTitlePlaceholder'
            />
          ) : null}

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
        </FormGroup>

        <MultiLanguageTextField
          labelId='sectionImageCaption'
          name='imageCaption'
          onBlur={(value) => onSectionImageChange(section.frontId, 'caption', value)}
          value={imageCaption}
          languages={sectionLanguages}
          placeholderId='sectionImagePlaceholder'
        />

        <MultiLanguageTextField
          labelId='sectionAbstract'
          maxLength={this.props.maxAbstractLength}
          name='abstract'
          onBlur={(value) => onSectionChange(section.frontId, 'abstract', value)}
          value={section.abstract}
          languages={sectionLanguages}
          fieldType={TextFieldTypes.TEXTAREA}
          placeholderId='sectionAbstractPlaceholder'
          richTextEditor
          hideControls={{
            hideBlockStyleControls: true,
            hideInlineStyleControls: true,
            hideIframeControls: true,
            hideImageControls: true,
            hideSkipLinkControls: true,
          }}
        />

        <MultiLanguageTextField
          richTextEditor
          labelId='sectionContent'
          name='content'
          onBlur={this.onSectionContentChange}
          rows='10'
          value={section.content}
          fieldType={TextFieldTypes.TEXTAREA}
          languages={sectionLanguages}
          placeholderId='sectionContentPlaceholder'
        />

        <FormGroup controlId='hearingCommenting'>
          <ControlLabel>
            <FormattedMessage id='hearingCommenting' />
          </ControlLabel>
          <div className='select'>
            <FormControl componentClass='select' name='commenting' onChange={this.onChange}>
              <option selected={section.commenting === 'open'} value='open'>
                {formatMessage({ id: 'openCommenting' })}
              </option>
              <option selected={section.commenting === 'registered'} value='registered'>
                {formatMessage({ id: 'registeredUsersOnly' })}
              </option>
              {config.enableStrongAuth && (
                <option selected={section.commenting === 'strong'} value='strong'>
                  {formatMessage({ id: 'registeredStrongOnly' })}
                </option>
              )}
              <option selected={section.commenting === 'none'} value='none'>
                {formatMessage({ id: 'noCommenting' })}
              </option>
            </FormControl>
          </div>
        </FormGroup>

        <FormGroup controlId='commentVoting'>
          <ControlLabel>
            <FormattedMessage id='commentVoting' />
          </ControlLabel>
          <div className='select'>
            <FormControl componentClass='select' name='voting' onChange={this.onChange}>
              <option selected={section.voting === 'open'} value='open'>
                {formatMessage({ id: 'openVoting' })}
              </option>
              <option selected={section.voting === 'registered'} value='registered'>
                {formatMessage({ id: 'registeredUsersOnly' })}
              </option>
            </FormControl>
          </div>
        </FormGroup>

        <Checkbox checked={!!this.state.enabledCommentMap} onChange={this.toggleEnableCommentMap}>
          <FormattedMessage id='hearingCommentingMap'>{(txt) => txt}</FormattedMessage>
        </Checkbox>
        {this.state.enabledCommentMap && (
          <FormGroup controlId='hearingCommentingMap'>
            <FormControl componentClass='select' name='commenting_map_tools' onChange={this.onChange}>
              <option selected={section.commenting_map_tools === 'none'} value='none'>
                {formatMessage({ id: 'hearingCommentingMapChoice1' })}
              </option>
              <option selected={section.commenting_map_tools === 'marker'} value='marker'>
                {formatMessage({ id: 'hearingCommentingMapChoice2' })}
              </option>
              <option selected={section.commenting_map_tools === 'all'} value='all'>
                {formatMessage({ id: 'hearingCommentingMapChoice3' })}
              </option>
            </FormControl>
          </FormGroup>
        )}
        <FormGroup controlId='hearingFiles'>
          <ControlLabel>
            <FormattedMessage id='hearingFileUpload' />
          </ControlLabel>
          <Dropzone accept='application/pdf' className={dropZoneClass} multiple={false} onDrop={this.onAttachmentDrop}>
            <span className='text'>
              <FormattedMessage id='selectOrDropFile' />
              <Icon className='icon' name='upload' />
            </span>
          </Dropzone>
          {this.renderAttachments(section)}
        </FormGroup>
        <FormGroup>
          <button
            className='btn btn-default question-control'
            type='button'
            onClick={() => this.props.initSingleChoiceQuestion(section.frontId)}
          >
            {formatMessage({ id: 'newSingleChoiceQuestion' })}
          </button>
          <button
            className='btn btn-default question-control'
            type='button'
            onClick={() => this.props.initMultipleChoiceQuestion(section.frontId)}
          >
            {formatMessage({ id: 'newMultipleChoiceQuestion' })}
          </button>
        </FormGroup>
        {!isEmpty(section.questions) &&
          section.questions.map((question, index) => (
            <div>
              <h5>{`${formatMessage({ id: 'question' })} ${index + 1}`}</h5>
              {question.frontId && (
                <button
                  type='button'
                  className='btn btn-danger pull-right'
                  onClick={() => onDeleteTemporaryQuestion(section.frontId, question.frontId)}
                >
                  {formatMessage({ id: 'deleteQuestion' })}
                </button>
              )}
              {question.id && !isPublic && (
                <button
                  type='button'
                  className='btn btn-danger pull-right'
                  onClick={() => onDeleteExistingQuestion(section.frontId, question.id)}
                >
                  {formatMessage({ id: 'deleteQuestion' })}
                </button>
              )}
              <FormGroup>
                <h6>
                  *{' '}
                  {question.type === 'single-choice'
                    ? formatMessage({ id: 'singleChoiceQuestion' })
                    : formatMessage({ id: 'multipleChoiceQuestion' })}
                </h6>
              </FormGroup>
              <QuestionForm
                key={question.id}
                question={question}
                addOption={addOption}
                deleteOption={deleteOption}
                sectionId={section.frontId}
                sectionLanguages={sectionLanguages}
                onQuestionChange={onQuestionChange}
                onDeleteExistingQuestion={onDeleteExistingQuestion}
                lang={language}
                isPublic={isPublic}
              />
            </div>
          ))}
      </div>
    );
  }
}

SectionForm.defaultProps = {
  maxAbstractLength: 450,
};

SectionForm.propTypes = {
  addOption: PropTypes.func,
  deleteOption: PropTypes.func,
  initMultipleChoiceQuestion: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  intl: intlShape.isRequired,
  isFirstSubsection: PropTypes.bool,
  isLastSubsection: PropTypes.bool,
  isPublic: PropTypes.bool,
  maxAbstractLength: PropTypes.number,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onEditSectionAttachmentOrder: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  onSectionAttachmentDelete: PropTypes.func,
  onSectionAttachmentEdit: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  section: sectionShape,
  sectionLanguages: PropTypes.arrayOf(PropTypes.string),
  sectionMoveDown: PropTypes.func,
  sectionMoveUp: PropTypes.func,
};

SectionForm.contextTypes = {
  language: PropTypes.string,
};

const WrappedSectionForm = injectIntl(SectionForm);

export default WrappedSectionForm;
