import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Button} from 'react-bootstrap';
import Icon from '../../utils/Icon';

const CreateHearingButton = ({onClick}) => (
  <div className="pull-right create-hearing-button-container" style={{marginTop: '-66px'}}>
    <Button bsStyle="success" onClick={onClick}>
      <Icon name="plus"/>&nbsp;&nbsp;
      <FormattedMessage id="createHearing"/>
    </Button>
  </div>
);

CreateHearingButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CreateHearingButton;
