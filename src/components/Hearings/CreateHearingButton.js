import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Button, ButtonToolbar} from 'react-bootstrap';

import Icon from '../../utils/Icon';
import Link from '../LinkWithLang';

const CreateHearingButton = ({to}) => (
  <div className="toolbar-bottom create-hearing-button-container">
    <ButtonToolbar className="actions pull-right">
      <Link to={to}>
        <Button bsStyle="success">
          <Icon name="plus"/>&nbsp;&nbsp;
          <FormattedMessage id="createHearing"/>
        </Button>
      </Link>
    </ButtonToolbar>
  </div>
);

CreateHearingButton.propTypes = {
  to: PropTypes.object.isRequired
};

export default CreateHearingButton;
