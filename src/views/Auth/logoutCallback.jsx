import React from 'react';
import { connect } from 'react-redux';
import { SignoutCallbackComponent } from 'redux-oidc';
import { useNavigate } from 'react-router-dom';

import userManager from '../../utils/oidcConfig';

const UnconnectedLogoutCallback = () => {
  const navigate = useNavigate();
  const logoutSuccessful = () => {
    localStorage.removeItem('votedComments');
    navigate('/');
  }

  const logoutUnsuccessful = () => {
    navigate('/');
  }

  return (
    <SignoutCallbackComponent
      errorCallback={() => logoutUnsuccessful()}
      successCallback={() => logoutSuccessful()}
      userManager={userManager}
    >
      <div />
    </SignoutCallbackComponent>
  );
}

export { UnconnectedLogoutCallback };
export default connect()(UnconnectedLogoutCallback);
