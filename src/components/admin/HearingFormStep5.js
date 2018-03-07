import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Icon from '../../utils/Icon';
import {injectIntl, FormattedMessage} from 'react-intl';

class HearingFormStep5 extends React.Component {
  onChange = () => {
    console.log('selected project changed');
  }
  render() {
    return (
      <div>
        <FormGroup controlId="hearingCommenting">
          <ControlLabel><FormattedMessage id="project"/></ControlLabel>
          <div className="select">
            <FormControl
              componentClass="select"
              name="commenting"
              onChange={this.onChange}
            >
              <option>option 1</option>
              <option>option 2</option>
              <option>option 3</option>
            </FormControl>
          </div>
        </FormGroup>
        <ButtonToolbar>
          <Button
            bsSize="small"
            bsStyle="default"
          >
            <Icon className="icon" name="plus"/> <FormattedMessage id="addProcess"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

HearingFormStep5.propTypes = {

};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const WrappedHearingFormStep5 = connect()(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
