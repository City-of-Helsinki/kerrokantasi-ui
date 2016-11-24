import _ from 'lodash';
import React from 'react';
import Label from 'react-bootstrap/lib/Label';

class LabelList extends React.Component {
  render() {
    const {labels, className} = this.props;
    /*
    * Hearing.labels
    *     Old API response: [String]
    *     New API response: [{id, label}]
    * TODO: Remove support for old styled API response when API has changed.
     */
    const newerLabelToHTML = ((label) => <span key={label.id}><Label>{label.label}</Label> </span>);
    const oldLabelToHTML = ((label) => <span key={label}><Label>{label}</Label> </span>);
    return (
      <div className={className}>
        {labels.map(_.isString(labels[0]) ? oldLabelToHTML : newerLabelToHTML)}
      </div>
    );
  }
}

LabelList.propTypes = {
  labels: React.PropTypes.array,
  className: React.PropTypes.string
};

export default LabelList;
