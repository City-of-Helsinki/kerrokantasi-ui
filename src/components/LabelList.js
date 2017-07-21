import React from 'react';
import PropTypes from 'prop-types';
import Label from 'react-bootstrap/lib/Label';
import getAttr from '../utils/getAttr';

class LabelList extends React.Component {
  render() {
    const {labels, className, language} = this.props;
    /*
    * Hearing.labels
    *     Old API response: [String]
    *     New API response: [{id, label}]
    * DONE: Remove support for old styled API response when API has changed.
     */
    // FIXME: add routing context or something similar to use react-router Link
    const labelToHTML = ((label) => <a href={`/hearings/list?label=${getAttr(label.label, language)}`} key={label.id}><Label bsStyle="info">{getAttr(label.label, language)}</Label> </a>);

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
