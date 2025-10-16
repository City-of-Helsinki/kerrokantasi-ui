import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from 'hds-react';

import Icon from '../../utils/Icon';
import Link from '../LinkWithLang';

const CreateHearingButton = ({ to }) => (
  <div className='toolbar-bottom create-hearing-button-container'>
    <div className='actions pull-right'>
      <Link to={to}>
        <Button className='kerrokantasi-btn success'>
          <Icon name='plus' />
          &nbsp;&nbsp;
          <FormattedMessage id='createHearing' />
        </Button>
      </Link>
    </div>
  </div>
);

CreateHearingButton.propTypes = {
  to: PropTypes.object.isRequired,
};

export default CreateHearingButton;
