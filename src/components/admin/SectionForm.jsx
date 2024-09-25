/* eslint-disable react/forbid-prop-types */
/* eslint-disable sonarjs/no-duplicate-string */
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Button, Card, Checkbox, FileInput, LoadingSpinner, Select } from 'hds-react';
import { isFirefox, isSafari, browserVersion } from 'react-device-detect';

import { QuestionForm } from './QuestionForm';
import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import { addToast } from '../../actions/toast';
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

const getFileTitle = (title, language) => {
  if (title?.[language] && typeof title[language] !== 'undefined') {
    return title[language];
  }
  return title[Object.keys(title).length - 1];
};

const fetchFiles = async (data, fileType, language) => {
  try {
    const promises = data.map(async (item) => {
      let name;

      if (fileType === 'image') {
        const imageSplit = item.url.split('/');
        name = imageSplit[imageSplit.length - 1];
      } else {
        name = getFileTitle(item.title, language);
      }

      const response = await fetch(item.url, { method: 'GET', mode: 'no-cors' });
      const blob = await response.blob();

      const file = new File([blob], name || fileType, {
        type: fileType === 'image' ? 'image/webp' : 'application/pdf',
      });

      return Promise.resolve({ id: item.id, name, file });
    });

    return Promise.all(promises);
  } catch (error) {
    return Promise.reject(new Error(error));
  }
};

const SectionForm = ({
  language,
  section,
  addOption,
  deleteOption,
  isFirstSubsection,
  isLastSubsection,
  isPublic,
  intl,
  maxAbstractLength,
  onDeleteExistingQuestion,
  onDeleteTemporaryQuestion,
  onQuestionChange,
  onSectionChange,
  onSectionImageChange,
  sectionLanguages,
  sectionMoveDown,
  sectionMoveUp,
  onSectionAttachment,
  onSectionAttachmentDelete,
  initSingleChoiceQuestion,
  initMultipleChoiceQuestion,
}) => {
  const [enabledCommentMap, setEnabledCommentMap] = useState(false);

  const [sectionImages, setSectionImages] = useState();
  const [attachments, setAttachments] = useState();

  const dispatch = useDispatch();

  const acceptedFiles = {
    'application/pdf': ['.pdf'],
  };

  const acceptedImages = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif'],
  };

  useEffect(() => {
    async function fetchImages() {
      if (section.images) {
        const data = await fetchFiles(section.images, 'image', language);

        setSectionImages(data);
      }
    }

    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.images]);

  useEffect(() => {
    async function fetchAttachments() {
      if (section.files) {
        const data = await fetchFiles(section.files, 'pdf', language);

        setAttachments(data);
      }
    }

    fetchAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.files]);

  useEffect(() => {
    if (section.commenting_map_tools !== 'none') {
      setEnabledCommentMap(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Modify section state and propagate necessary information
   * up to the parent components.
   * @param  {object} event OnClick event
   */
  const onChange = (selected, field) => {
    // Propagate interesting changes to parent components
    const { value } = selected;

    switch (field) {
      case 'imageCaption':
        onSectionImageChange(section.frontId, 'caption', value);
        break;
      case 'commenting_map_tools':
        onSectionChange(section.frontId, field, value);
        break;
      default:
        onSectionChange(section.frontId, field, value);
    }
  };

  const onImageChange = (files) => {
    const file = files[0];

    if (!file) {
      onSectionImageChange(section.frontId, 'image', file);

      return;
    }

    const fileReader = new FileReader();

    fileReader.addEventListener('error', () => {
      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'imageFileUploadError')));
    });
    fileReader.addEventListener(
      'load',
      (event) => {
        // New img element is created with the uploaded image.
        const img = document.createElement('img');
        img.src = event.target.result;
        img.onerror = () => {
          dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'imageFileUploadError')));
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
  };

  /**
   * when attachment is dropped on the dropzone field.
   * @param {File} attachment - file to upload.
   */
  const onAttachmentChange = (files) => {
    const filesToDelete = attachments?.filter(
      (item, oldIndex) =>
        !files.some(
          (newFile, newIndex) =>
            item.file.name === newFile.name && item.file.size === newFile.size && oldIndex === newIndex,
        ),
    );

    const filesToAdd = files.filter(
      (newFile, newIndex) =>
        !attachments?.some(
          (item, oldIndex) =>
            newFile.name === item.file.name && newFile.size === item.file.size && newIndex === oldIndex,
        ),
    );

    if (filesToDelete.length) {
      filesToDelete.forEach((file) => onSectionAttachmentDelete(section.frontId, file));
    }

    if (filesToAdd.length) {
      // Load the file and then upload it.
      const fileReader = new FileReader();

      filesToAdd.forEach((file) => {
        fileReader.addEventListener('load', (event) => {
          if (onSectionAttachment) {
            onSectionAttachment(section.frontId, event.target.result, { [language]: file.name });
          }
        });

        fileReader.readAsDataURL(file);
      });
    }
  };

  const onSectionContentChange = (value) => onSectionChange(section.frontId, 'content', value);

  const getImageCaption = (getSection) => get(getSection.images, '[0].caption', {});

  const toggleEnableCommentMap = () => {
    setEnabledCommentMap(!enabledCommentMap);

    if (enabledCommentMap) {
      onChange({ target: { name: 'commenting_map_tools', value: 'none' } });
    }
  };

  const getImage = () => {
    const { images } = section;

    if (images && images.length) {
      // Image property may contain the base64 encoded image
      return images[0].image || images[0].url;
    }

    return '';
  };

  const imageCaption = getImageCaption(section);

  const { formatMessage } = intl;

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

  if (!section || !sectionImages || !attachments) {
    return <LoadingSpinner />;
  }

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
        <Card
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-s)' }}
        >
          <img style={{ maxWidth: '100%', height: 'auto' }} src={getImage()} alt='' />
        </Card>
        <FileInput
          id='sectionImage'
          name='sectionImage'
          dragAndDrop
          label={<FormattedMessage id='sectionImage' />}
          accept={acceptedImages}
          helperText={<FormattedMessage id='sectionImageHelpText' />}
          language={language}
          onChange={onImageChange}
          defaultValue={sectionImages}
          value={sectionImages}
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
        maxLength={maxAbstractLength}
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
        onBlur={onSectionContentChange}
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
          onChange={(selected) => onChange(selected, 'commenting')}
          options={commentingOptions}
          defaultValue={commentingOptions[0]}
        />
      </div>
      <div id='commentVoting' style={{ marginBottom: 'var(--spacing-m)' }}>
        <Select
          id='voting'
          name='voting'
          label={<FormattedMessage id='commentVoting' />}
          onChange={(selected) => onChange(selected, 'voting')}
          options={votingOptions}
          defaultValue={votingOptions[0]}
        />
      </div>
      <div style={{ marginBottom: 'var(--spacing-m)' }}>
        <Checkbox
          checked={!!enabledCommentMap}
          label={<FormattedMessage id='hearingCommentingMap'>{(txt) => txt}</FormattedMessage>}
          onChange={toggleEnableCommentMap}
        />
      </div>
      {enabledCommentMap && (
        <div id='hearingCommentingMap' style={{ marginBottom: 'var(--spacing-m)' }}>
          <Select
            id='commenting_map_tools'
            name='commenting_map_tools'
            options={commentingMapOptions}
            defaultValue={commentingMapOptions[0]}
            onChange={(selected) => onChange(selected, 'commenting_map_tools')}
          />
        </div>
      )}
      <div id='hearingFiles' style={{ marginBottom: 'var(--spacing-m)' }}>
        <FileInput
          id='selectOrDropFile'
          name='selectOrDropFile'
          dragAndDrop
          label={<FormattedMessage id='selectOrDropFile' />}
          accept={acceptedFiles}
          language={language}
          onChange={onAttachmentChange}
          defaultValue={attachments}
          maxSize={MAX_FILE_SIZE}
          multiple
        />
      </div>
      <div>
        <Button className='question-control kerrokantasi-btn' onClick={() => initSingleChoiceQuestion(section.frontId)}>
          {formatMessage({ id: 'newSingleChoiceQuestion' })}
        </Button>
        <Button
          className='question-control kerrokantasi-btn'
          onClick={() => initMultipleChoiceQuestion(section.frontId)}
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
};

SectionForm.defaultProps = {
  maxAbstractLength: 450,
};

SectionForm.propTypes = {
  addOption: PropTypes.func,
  deleteOption: PropTypes.func,
  initMultipleChoiceQuestion: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  isFirstSubsection: PropTypes.bool,
  isLastSubsection: PropTypes.bool,
  isPublic: PropTypes.bool,
  language: PropTypes.string,
  maxAbstractLength: PropTypes.number,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  onSectionAttachmentDelete: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  section: sectionShape,
  sectionLanguages: PropTypes.arrayOf(PropTypes.string),
  sectionMoveDown: PropTypes.func,
  sectionMoveUp: PropTypes.func,
  intl: PropTypes.object,
};

SectionForm.contextTypes = {
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  language: state.language,
});

const WrappedSectionForm = injectIntl(SectionForm);

export default connect(mapStateToProps, null)(WrappedSectionForm);
