import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Icon from '../../utils/Icon';

const CreateHearingButton = ({onClick}) => (
  <div className="toolbar-bottom create-hearing-button-container">
    <ButtonToolbar className="actions pull-right">
      <Button bsStyle="success" onClick={onClick}>
        <Icon name="plus"/>&nbsp;&nbsp;
        <FormattedMessage id="createHearing"/>
      </Button>
    </ButtonToolbar>
  </div>
);

CreateHearingButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CreateHearingButton;
