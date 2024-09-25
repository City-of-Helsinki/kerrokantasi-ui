/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Button, Checkbox, FileInput, Select } from 'hds-react';
import { isFirefox, isSafari, browserVersion } from 'react-device-detect';

import { QuestionForm } from './QuestionForm';
import { localizedNotifyError, notifyError } from '../../utils/notify';
import MultiLanguageTextField, { TextFieldTypes } from '../forms/MultiLanguageTextField';
import { sectionShape } from '../../types';
import { isSpecialSectionType } from '../../utils/section';

/**
 * MAX_IMAGE_SIZE given in bytes
 * MAX_FILE_SIZE given in MB
 */
const MAX_IMAGE_SIZE = 999999;
const MAX_FILE_SIZE = 70000000;

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
  onChange(selected, field) {
    // Propagate interesting changes to parent components
    const { value } = selected;
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
    const { section, language } = this.props;
    const file = attachment[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      if (this.props.onSectionAttachment) {
        this.props.onSectionAttachment(section.frontId, fileReader.result, { [language]: file.name });
      }
    });
    fileReader.readAsDataURL(file);
  };

  onSectionContentChange(value) {
    const { onSectionChange, section } = this.props;
    onSectionChange(section.frontId, 'content', value);
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
      language,
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
    const imageCaption = SectionForm.getImageCaption(section, language);
    const { formatMessage } = this.props.intl;

    const commentingOptions = [
      { value: 'open', label: formatMessage({ id: 'openCommenting' }) },
      { value: 'registered', label: formatMessage({ id: 'registeredUsersOnly' }) },
      { value: 'strong', label: formatMessage({ id: 'registeredStrongOnly' }) },
      { value: 'none', label: formatMessage({ id: 'noCommenting' }) },
    ];

    const votingOptions = [
      { value: 'open', label: formatMessage({ id: 'openVoting' }) },
      { value: 'registered', label: formatMessage({ id: 'registeredUsersOnly' }) },
    ];

    const commentingMapOptions = [
      { value: 'none', label: formatMessage({ id: 'hearingCommentingMapChoice1' }) },
      { value: 'marker', label: formatMessage({ id: 'hearingCommentingMapChoice2' }) },
      { value: 'all', label: formatMessage({ id: 'hearingCommentingMapChoice3' }) },
    ];

    return (
      <div className='form-step'>
        {section.type !== 'closure-info' && section.type !== 'main' && (
          <div className='section-toolbar'>
            <div>
              <Button
                onClick={() => sectionMoveUp(section.frontId)}
                disabled={isFirstSubsection}
                style={{ marginRight: '10px' }}
              >
                &uarr; <FormattedMessage id='moveUp' />
              </Button>
              <Button onClick={() => sectionMoveDown(section.frontId)} disabled={isLastSubsection}>
                <FormattedMessage id='moveDown' /> &darr;
              </Button>
            </div>
          </div>
        )}
        <div id='image' style={{ marginBottom: 'var(--spacing-s)' }}>
          {!isSpecialSectionType(section.type) && (
            <MultiLanguageTextField
              labelId='sectionTitle'
              name='title'
              onBlur={(value) => onSectionChange(section.frontId, 'title', value)}
              value={section.title}
              languages={sectionLanguages}
              placeholderId='sectionTitlePlaceholder'
            />
          )}
          <FileInput
            id='sectionImage'
            name='sectionImage'
            dragAndDrop
            label={<FormattedMessage id='sectionImage' />}
            accept='image/*'
            helperText={<FormattedMessage id='sectionImageHelpText' />}
            language={language}
            onChange={this.onFileDrop}
            defaultValue={this.getImage()}
            maxSize={MAX_IMAGE_SIZE}
          />
        </div>
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
        <div id='hearingCommenting' style={{ marginBottom: 'var(--spacing-s)' }}>
          <Select
            id='commenting'
            name='commenting'
            label={<FormattedMessage id='hearingCommenting' />}
            onChange={(selected) => this.onChange(selected, 'commenting')}
            options={commentingOptions}
            defaultValue={commentingOptions[0]}
          />
        </div>
        <div id='commentVoting' style={{ marginBottom: 'var(--spacing-m)' }}>
          <Select
            id='voting'
            name='voting'
            label={<FormattedMessage id='commentVoting' />}
            onChange={(selected) => this.onChange(selected, 'voting')}
            options={votingOptions}
            defaultValue={votingOptions[0]}
          />
        </div>
        <div style={{ marginBottom: 'var(--spacing-m)' }}>
          <Checkbox
            checked={!!this.state.enabledCommentMap}
            label={<FormattedMessage id='hearingCommentingMap'>{(txt) => txt}</FormattedMessage>}
            onChange={this.toggleEnableCommentMap}
          />
        </div>
        {this.state.enabledCommentMap && (
          <div id='hearingCommentingMap' style={{ marginBottom: 'var(--spacing-m)' }}>
            <Select
              id='commenting_map_tools'
              name='commenting_map_tools'
              options={commentingMapOptions}
              defaultValue={commentingMapOptions[0]}
              onChange={(selected) => this.onChange(selected, 'commenting_map_tools')}
            />
          </div>
        )}
        <div id='hearingFiles' style={{ marginBottom: 'var(--spacing-m)' }}>
          <FileInput
            id='selectOrDropFile'
            name='selectOrDropFile'
            dragAndDrop
            label={<FormattedMessage id='selectOrDropFile' />}
            accept='application/pdf'
            language={language}
            onChange={this.onAttachmentDrop}
            defaultValue={section.files}
            maxSize={MAX_FILE_SIZE}
            multiple
          />
        </div>
        <div>
          <Button
            className='question-control kerrokantasi-btn'
            onClick={() => this.props.initSingleChoiceQuestion(section.frontId)}
          >
            {formatMessage({ id: 'newSingleChoiceQuestion' })}
          </Button>
          <Button
            className='question-control kerrokantasi-btn'
            onClick={() => this.props.initMultipleChoiceQuestion(section.frontId)}
          >
            {formatMessage({ id: 'newMultipleChoiceQuestion' })}
          </Button>
        </div>
        {!isEmpty(section.questions) &&
          section.questions.map((question, index) => (
            <div>
              <h5>{`${formatMessage({ id: 'question' })} ${index + 1}`}</h5>
              {question.frontId && (
                <Button
                  className='kerrokantasi-btn danger pull-right'
                  onClick={() => onDeleteTemporaryQuestion(section.frontId, question.frontId)}
                >
                  {formatMessage({ id: 'deleteQuestion' })}
                </Button>
              )}
              {question.id && !isPublic && (
                <Button
                  className='kerrokantasi-btn danger pull-right'
                  onClick={() => onDeleteExistingQuestion(section.frontId, question.id)}
                >
                  {formatMessage({ id: 'deleteQuestion' })}
                </Button>
              )}
              <div>
                <h6>
                  *{' '}
                  {question.type === 'single-choice'
                    ? formatMessage({ id: 'singleChoiceQuestion' })
                    : formatMessage({ id: 'multipleChoiceQuestion' })}
                </h6>
              </div>
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
  language: PropTypes.string,
  maxAbstractLength: PropTypes.number,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  // onEditSectionAttachmentOrder: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  // onSectionAttachmentDelete: PropTypes.func,
  // onSectionAttachmentEdit: PropTypes.func,
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

const mapStateToProps = (state) => ({
  language: state.language,
});

const WrappedSectionForm = injectIntl(SectionForm);

export default connect(mapStateToProps, null)(WrappedSectionForm);
