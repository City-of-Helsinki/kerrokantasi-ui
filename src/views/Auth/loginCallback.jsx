import React from 'react';
import { LoginCallbackHandler , useApiTokens } from 'hds-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setOidcUser, setApiToken } from '../../actions';
import useUpdateApiTokens from './hooks/useUpdateApiTokens';
import useAuthHook from '../../hooks/useAuth';

const UnconnectedLoginCallback = (props) => {

  const { history, dispatchSetOidcUser, dispatchSetApiToken} = props;
  const { updateApiTokens } = useUpdateApiTokens();
  const { getStoredApiTokens } = useApiTokens();
  const { user } = useAuthHook();

  const success = async () => {
    await updateApiTokens();
    if (user) {
      const tmpToken = getStoredApiTokens().filter(token => token);
      dispatchSetOidcUser(user);
      dispatchSetApiToken(tmpToken);
    }
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

const mapDispatchToProps = (dispatch) => ({
    dispatchSetOidcUser: (user) => dispatch(setOidcUser(user)),
    dispatchSetApiToken: (token) => dispatch(setApiToken(token)),
  })

UnconnectedLoginCallback.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  dispatchSetApiToken: PropTypes.func,
  dispatchSetOidcUser: PropTypes.func,
};

export { UnconnectedLoginCallback };
export default connect(null, mapDispatchToProps)(UnconnectedLoginCallback);
