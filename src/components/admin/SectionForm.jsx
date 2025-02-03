/* eslint-disable react/forbid-prop-types */
/* eslint-disable sonarjs/no-duplicate-string */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Button, Card, Checkbox, FileInput, LoadingSpinner, Select } from 'hds-react';
import imageCompression from 'browser-image-compression';

import { QuestionForm } from './QuestionForm';
import MultiLanguageTextField, { TextFieldTypes } from '../forms/MultiLanguageTextField';
import { sectionShape } from '../../types';
import { isSpecialSectionType } from '../../utils/section';

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

      const response = await fetch(item.url, {
        method: 'GET',
        mode: 'no-cors',
      });

      const blob = await response.blob();

      const type = fileType === 'image' ? 'image/webp' : 'application/pdf';

      const file = new File([blob], name || fileType, {
        type,
      });

      return Promise.resolve({ id: item.id, name, type, file });
    });

    return Promise.all(promises);
  } catch (error) {
    return Promise.reject(new Error(error));
  }
};

/**
 * MAX_IMAGE_SIZE given in MB
 * MAX_FILE_SIZE given in MB
 */
const MAX_IMAGE_SIZE = 0.9;
const MAX_FILE_SIZE = 70;

const SectionForm = ({
  language,
  section,
  addOption,
  deleteOption,
  isFirstSubsection,
  isLastSubsection,
  isPublic,
  maxAbstractLength,
  onDeleteExistingQuestion,
  onDeleteTemporaryQuestion,
  onQuestionChange,
  onSectionChange,
  onSectionImageSet,
  onSectionImageDelete,
  onSectionImageCaptionChange,
  sectionLanguages,
  sectionMoveDown,
  sectionMoveUp,
  onSectionAttachment,
  onSectionAttachmentDelete,
  initSingleChoiceQuestion,
  initMultipleChoiceQuestion,
}) => {
  const [enabledCommentMap, setEnabledCommentMap] = useState(section.commenting_map_tools !== 'none');
  const [sectionImage, setSectionImage] = useState();
  const [attachments, setAttachments] = useState();

  const intl = useIntl();

  useEffect(() => {
    async function fetchImages() {
      if (section.images.length && section.images[0].url) {
        const data = await fetchFiles(section.images, 'image', language);

        setSectionImage(data);
      }
    }

    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.images]);

  useEffect(() => {
    async function fetchAttachments() {
      if (section.files.length) {
        const data = await fetchFiles(section.files, 'pdf', language);

        setAttachments(data);
      }
    }

    fetchAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.files]);

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
        onSectionImageCaptionChange(section.frontId, value);
        break;
      case 'commenting_map_tools':
        onSectionChange(section.frontId, field, value);
        break;
      default:
        onSectionChange(section.frontId, field, value);
    }
  };

  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        resolve(event.target.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsDataURL(file);
    });

  const compressFile = async (file, maxSizeMB, fileType) => imageCompression(file, { maxSizeMB, fileType });

  const onImageChange = async (files) => {
    try {
      const file = files[0];

      if (!file) {
        onSectionImageDelete(section.frontId);

        return;
      }

      const compressed = await compressFile(file, MAX_IMAGE_SIZE, 'image/webp');
      const blob = await fileToDataUri(compressed);

      onSectionImageSet(section.frontId, blob);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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

    if (filesToDelete?.length) {
      filesToDelete.forEach((file) => onSectionAttachmentDelete(section.frontId, file));
    }

    if (filesToAdd?.length) {
      // Load the file and then upload it.

      filesToAdd.forEach(async (file) => {
        const blob = await fileToDataUri(file);

        onSectionAttachment(section.frontId, blob, { [language]: file.name });
      });
    }
  };

  const onSectionContentChange = (value) => onSectionChange(section.frontId, 'content', value);

  const getImageCaption = (getSection) => get(getSection.images, '[0].caption', {});

  const toggleEnableCommentMap = () => {
    setEnabledCommentMap(!enabledCommentMap);

    if (enabledCommentMap) {
      onChange({ value: 'none' }, 'commenting_map_tools');
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

  const commentingInitialValue = section.commenting
    ? commentingOptions.find((option) => option.value === section.commenting)
    : commentingOptions[0];

  const votingOptions = [
    { value: 'open', label: formatMessage({ id: 'openVoting' }) },
    { value: 'registered', label: formatMessage({ id: 'registeredUsersOnly' }) },
  ];

  const votingInitialValue = section.voting
    ? votingOptions.find((option) => option.value === section.voting)
    : votingOptions[0];

  const commentingMapOptions = [
    { value: 'none', label: formatMessage({ id: 'hearingCommentingMapChoice1' }) },
    { value: 'marker', label: formatMessage({ id: 'hearingCommentingMapChoice2' }) },
    { value: 'all', label: formatMessage({ id: 'hearingCommentingMapChoice3' }) },
  ];

  const commentingMapInitialValue = section.commenting_map_tools
    ? commentingMapOptions.find((option) => option.value === section.commenting_map_tools)
    : commentingMapOptions[0];

  if (!section) {
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
          accept='.jpeg,.jpg,.png,.webp,.gif'
          helperText={<FormattedMessage id='sectionImageHelpText' />}
          language={language}
          onChange={onImageChange}
          maxSize={MAX_IMAGE_SIZE * 1024 * 1024}
          defaultValue={sectionImage}
        />
      </div>
      <MultiLanguageTextField
        labelId='sectionImageCaption'
        name='imageCaption'
        onBlur={(value) => onSectionImageCaptionChange(section.frontId, value)}
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
          defaultValue={commentingInitialValue}
        />
      </div>
      <div id='commentVoting' style={{ marginBottom: 'var(--spacing-m)' }}>
        <Select
          id='voting'
          name='voting'
          label={<FormattedMessage id='commentVoting' />}
          onChange={(selected) => onChange(selected, 'voting')}
          options={votingOptions}
          defaultValue={votingInitialValue}
        />
      </div>
      <div style={{ marginBottom: 'var(--spacing-m)' }}>
        <Checkbox
          checked={!!enabledCommentMap}
          label={intl.formatMessage({ id: 'hearingCommentingMap' })}
          onChange={toggleEnableCommentMap}
        />
      </div>
      {enabledCommentMap && (
        <div data-testid='hearingCommentingMap' id='hearingCommentingMap' style={{ marginBottom: 'var(--spacing-m)' }}>
          <Select
            id='commenting_map_tools'
            name='commenting_map_tools'
            options={commentingMapOptions}
            defaultValue={commentingMapInitialValue}
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
          accept='application/pdf'
          language={language}
          onChange={onAttachmentChange}
          defaultValue={attachments}
          maxSize={MAX_FILE_SIZE * 1024 * 1024}
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
  onSectionImageSet: PropTypes.func,
  onSectionImageDelete: PropTypes.func,
  onSectionImageCaptionChange: PropTypes.func,
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

export default connect(mapStateToProps, null)(SectionForm);
