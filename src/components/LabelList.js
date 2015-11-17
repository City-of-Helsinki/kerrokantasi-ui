import React from 'react';
import Label from 'react-bootstrap/lib/Label';

class LabelList extends React.Component {
  render() {
    const {labels} = this.props;
    return (<div>{labels.map((label) => <span key={label}><Label>{label}</Label> </span>)}</div>);
  }
}

LabelList.propTypes = {
  labels: React.PropTypes.array
};

export default LabelList;
