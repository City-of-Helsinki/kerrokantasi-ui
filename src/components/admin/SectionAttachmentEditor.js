import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import FormControl from 'react-bootstrap/lib/FormControl';
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
  return title[Object.keys(title).length -1];
}

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
}

/**
 * Class decleration for Section attachment editor
 */
const SectionAttachmentEditor = (props) => {
  const { file, language, fileCount } = props;
  return (
    <div className="section-attachment-editor">
      <div className="section-attachment-edit-icon"><Icon name="file"/></div>
      <div className="section-attachment-editor-input">
        <FormControl
          defaultValue={getFileTitle(file.title, language)}
          maxLength={100}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder={'FIle title'}
          type="text"
        />
      </div>
      <div className="Section-attachment-editor-actions">
        <button type="button" className="btn btn-default pull-right" disabled={ isDisabled(fileCount, file.ordering, 'increment') }>&uarr;</button>
        <button type="button" className="btn btn-default pull-right" disabled={ isDisabled(fileCount, file.ordering, 'decrement') }>&darr;</button>
        <button type="button" className="btn btn-default pull-right">
          <Icon style={{fontSize: '24px', marginRight: '12px'}} className="icon" name="trash" />
          <FormattedMessage id="deleteAttachment"/>
        </button>
      </div>
    </div>
  )
};

SectionAttachmentEditor.propTypes = {
  file: PropTypes.object.isRequired,
  fileCount: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
};


export default SectionAttachmentEditor;
