import React from 'react';
import { LoginCallbackHandler } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useUpdateApiTokens from './hooks/useUpdateApiTokens';

const UnconnectedLoginCallback = () => {
  const navigate = useNavigate();
  const { updateApiTokens } = useUpdateApiTokens();

  const success = async () => {
    await updateApiTokens();
    localStorage.removeItem('votedComments');
    navigate('/');
  };

  const failure = () => {
    navigate('/');
  };

  return (
    <LoginCallbackHandler onSuccess={success} onError={failure}>
      <div>Redirecting...</div>
    </LoginCallbackHandler>
  );
}

UnconnectedLoginCallback.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export { UnconnectedLoginCallback };
export default connect(null, null)(UnconnectedLoginCallback);
