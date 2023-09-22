import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage } from 'react-intl';

function PleaseLogin({ login }) {
  return (
    <div>
      <h3>
        <FormattedMessage id='loginToContinue' />
      </h3>
      <Button onClick={login}>
        <FormattedMessage id='login' />
      </Button>
    </div>
  );
}

PleaseLogin.propTypes = {
  login: PropTypes.func,
};

export default PleaseLogin;
