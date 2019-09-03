import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../utils/Icon';


/**
 * Determines the correct title to return
 * @param {Object} title - title object
 * @param {String} language - language of application
 */
const getFileTitle = (title, language) => {
  if (title && title[language] && typeof title[language] === 'string') {
    return title[language];
  }
  return title[Object.keys(title)];
};

/**
 * Class declaration
 * Renders list of attachments available to a section.
 */
const SectionAttachment = (props) => (
  <div className="section-attachment">
    <Icon className="icon" name="file"/>
    <a href={props.file.url} className="section-attachment-title" target="__blank">
      {getFileTitle(props.file.title, props.language)}
    </a>
  </div>
);

SectionAttachment.propTypes = {
  file: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
};

export default SectionAttachment;
export { getFileTitle };
