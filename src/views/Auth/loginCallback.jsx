import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import userManager from '../../utils/userManager';

class CallbackPage extends React.Component {
  success = () => {
    localStorage.removeItem('votedComments');
    this.props.dispatch(push('/'));
  };

  failure = () => {
    this.props.dispatch(push('/'));
  };

  render() {
    return (
      <CallbackComponent userManager={userManager} successCallback={this.success} errorCallback={this.failure}>
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

CallbackPage.propTypes = {
  dispatch: PropTypes.func,
};

export { CallbackPage as UnconnectedCallbackPage };
export default connect()(CallbackPage);
