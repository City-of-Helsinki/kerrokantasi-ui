import React from 'react';
import { LoginCallbackHandler } from 'hds-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useUpdateApiTokens from './hooks/useUpdateApiTokens';

const UnconnectedLoginCallback = (props) => {

  const { history } = props;
  const { updateApiTokens } = useUpdateApiTokens();

  const success = async () => {
    await updateApiTokens();
    localStorage.removeItem('votedComments');
    history.push('/');
  };

  const failure = () => {
    history.push('/');
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
