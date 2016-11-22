import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';


class InputBase extends React.Component {

  getLabelHint() {
    if (!this.props.maxLength || !this.props.value) {
      return null;
    }
    return (
      <small className="field-hint">
        {` (${this.props.value.length} / ${this.props.maxLength} `}
        <FormattedMessage id="charachters"/>)
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
  name: React.PropTypes.string,
  value: React.PropTypes.string,
};

export default injectIntl(InputBase);
