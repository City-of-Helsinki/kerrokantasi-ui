import React from 'react';
import Label from 'react-bootstrap/lib/Label';

class LabelList extends React.Component {
  render() {
    const {labels, className} = this.props;
    return (<div className={className}>{labels.map((label) => <span key={label}><Label>{label}</Label> </span>)}</div>);
  }
}

LabelList.propTypes = {
  labels: React.PropTypes.array,
  className: React.PropTypes.string
};

export default LabelList;
