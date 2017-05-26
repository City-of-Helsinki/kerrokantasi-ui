import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';


class InputBase extends React.Component {

  getLabelHint() {
    const {maxLength, value, required} = this.props;

    const LengthHint = () => (maxLength && value ? (
      <span>
        {` (${value.length} / ${maxLength} `}
        <FormattedMessage id="characters"/>)
      </span>
    ) : null);

    const RequiredHint = () => (required ? (
      <span>*</span>
    ) : null);

    return (
      <small className="field-hint">
        <LengthHint/>
        <RequiredHint/>
      </small>
    );
  }

  render() {
    const error = this.props.error;

    return (
      <FormGroup controlId={this.props.name} validationState={error ? "error" : null}>
        <ControlLabel>
          <FormattedMessage id={this.props.labelId}/>
          {this.getLabelHint()}
        </ControlLabel>
        {this.props.children}
        {error ? <HelpBlock>{error}</HelpBlock> : null}
      </FormGroup>
    );
  }
}

InputBase.propTypes = {
  children: React.PropTypes.element,
  error: React.PropTypes.string,
  labelId: React.PropTypes.string,
  maxLength: React.PropTypes.number,
  required: React.PropTypes.bool,
  name: React.PropTypes.string,
  value: React.PropTypes.string,
};

export default injectIntl(InputBase);
