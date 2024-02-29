/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FormControl from 'react-bootstrap/lib/FormControl';
import { Button } from 'hds-react';

import Icon from '../../utils/Icon';

/**
 * Get the right title for the file based on language.
 * @param {Object} title - Title of the file.
 * @param {String} language - language of the applicaiton (currently e.g. FI)
 * @returns {String} title.
 */
const getFileTitle = (title, language) => {
  if (title && title[language] && typeof title[language] !== 'undefined') {
    return title[language];
  }
  return title[Object.keys(title).length - 1];
};

/**
 * Determines whether file order can be incremented or decremented.
 * @param {Number} fileCount - total number of files.
 * @param {*} currentOrder - current order of the file.
 * @param {*} type - type of action
 */
const isDisabled = (fileCount, currentOrder, type) => {
  if (type === 'increment') {
    return Number(currentOrder) === 1;
  }
  return Number(currentOrder) === Number(fileCount);
};

/**
 * Class decleration for Section attachment editor
 */
const SectionAttachmentEditor = (props) => {
  const { file, language, fileCount, section } = props;
  const [title, updateTitle] = React.useState(getFileTitle(file.title, language));

  /**
   * Method that will update the state of title
   * @param {Callback} event - callback event from onChange method
   */
  const handleUpdateTitle = (event) => {
    updateTitle(event.target.value);
  };

  /**
   * Callback method when delete button is pressed for a file in section
   */
  const handleOnClickDeleteButton = () => {
    props.onSectionAttachmentDelete(section.frontId, file);
  };

  /**
   * Increase the order of the file.
   */
  const handleIncrementOrder = () => {
    const otherFile = section.files[file.ordering - 2];
    // -2 to compensate for the default ordering offset, array start from 0, offset from 1
    props.onEditSectionAttachmentOrder(section.frontId, [
      { ...file, ordering: file.ordering - 1 },
      { ...otherFile, ordering: file.ordering },
    ]);
  };

  const handleDecrementOrder = () => {
    const otherFile = section.files[file.ordering];
    // +1 to compensate for the default ordering offset, array start from 0, offset from 1
    props.onEditSectionAttachmentOrder(section.frontId, [
      { ...file, ordering: file.ordering + 1 },
      { ...otherFile, ordering: file.ordering },
    ]);
  };

  /**
   * When field focus is left update the store
   */
  const handleOnBlurField = () => {
    const updatedAttachment = { ...file, title: { ...file.title, [language]: title } };
    props.onSectionAttachmentEdit(section.frontId, updatedAttachment);
  };

  return (
    <div className='section-attachment-editor'>
      <div className='section-attachment-edit-icon'>
        <Icon name='file' />
      </div>
      <div className='section-attachment-editor-input'>
        <FormControl
          defaultValue={title}
          value={title}
          maxLength={100}
          onBlur={handleOnBlurField}
          onChange={handleUpdateTitle}
          placeholder='File title'
          type='text'
        />
      </div>
      <div className='Section-attachment-editor-actions'>
        <Button
          disabled={isDisabled(fileCount, file.ordering, 'increment')}
          onClick={handleIncrementOrder}
        >
          &uarr;
        </Button>
        <Button
          disabled={isDisabled(fileCount, file.ordering, 'decrement')}
          onClick={handleDecrementOrder}
        >
          &darr;
        </Button>
        <Button onClick={handleOnClickDeleteButton}>
          <Icon style={{ fontSize: '24px', marginRight: '12px' }} className='icon' name='trash' />
          <FormattedMessage id='deleteAttachment' />
        </Button>
      </div>
    </div>
  );
};

SectionAttachmentEditor.propTypes = {
  file: PropTypes.object.isRequired,
  fileCount: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  onEditSectionAttachmentOrder: PropTypes.func.isRequired,
  onSectionAttachmentDelete: PropTypes.func.isRequired,
  onSectionAttachmentEdit: PropTypes.func.isRequired,
  section: PropTypes.object.isRequired,
};

export default SectionAttachmentEditor;
