import React from 'react';
import PropTypes from 'prop-types';
import Label from 'react-bootstrap/lib/Label';
import getAttr from '../utils/getAttr';
import Link from './LinkWithLang';

class LabelList extends React.Component {
  render() {
    const {labels, className, language} = this.props;
    /*
    * Hearing.labels
    *     Old API response: [String]
    *     New API response: [{id, label}]
    * DONE: Remove support for old styled API response when API has changed.
     */
    const labelToHTML = (label) => (
      <Link to={{path: '/hearings/list', search: `?label=${label.id}`}} key={label.id || label}>
        <Label bsStyle="info">{getAttr(label.label, language)}</Label>{' '}
      </Link>
    );

    return (
      <div className={className}>
        {labels.map((label) => labelToHTML(label))}
      </div>
    );
  }
}

LabelList.propTypes = {
  labels: PropTypes.array,
  className: PropTypes.string,
  language: PropTypes.string
};

export default LabelList;
