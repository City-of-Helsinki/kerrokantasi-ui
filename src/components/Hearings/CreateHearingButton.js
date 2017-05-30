import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Button} from 'react-bootstrap';
import Icon from '../../utils/Icon';

const CreateHearingButton = ({onClick}) => (
  <div className="pull-right create-hearing-button-container">
    <Button bsStyle="primary" onClick={onClick}>
      <Icon name="add"/><FormattedMessage id="createHearing"/>
    </Button>
  </div>
);

CreateHearingButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CreateHearingButton;
