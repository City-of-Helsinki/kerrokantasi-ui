import React from 'react';
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
    const labelToHTML = ((label) => <a href={`/hearings/list?label=${getAttr(label.label, language)}`} key={label.id}><Label>{getAttr(label.label, language)}</Label> </a>);

    return (
      <div className={className}>
        {labels.map((label) => labelToHTML(label))}
      </div>
    );
  }
}

LabelList.propTypes = {
  labels: React.PropTypes.array,
  className: React.PropTypes.string,
  language: React.PropTypes.string
};

export default LabelList;
