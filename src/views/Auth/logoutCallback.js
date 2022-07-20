import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {SignoutCallbackComponent} from 'redux-oidc';
import {push} from "react-router-redux";

import userManager from '../../utils/userManager';

class UnconnectedLogoutCallback extends React.Component {
  constructor(props) {
    super(props);

    this.logoutSuccessful = this.logoutSuccessful.bind(this);
    this.logoutUnsuccessful = this.logoutUnsuccessful.bind(this);
  }

  logoutSuccessful() {
    localStorage.removeItem("votedComments");
    this.props.dispatch(push("/"));
  }

  logoutUnsuccessful() {
    this.props.dispatch(push("/"));
  }

  render() {
    return (
      <SignoutCallbackComponent
        errorCallback={error => this.logoutUnsuccessful(error)}
        successCallback={user => this.logoutSuccessful(user)}
        userManager={userManager}
      >
        <div />
      </SignoutCallbackComponent>
    );
  }
}

UnconnectedLogoutCallback.propTypes = {
  dispatch: PropTypes.func,
};

export {UnconnectedLogoutCallback};
export default connect()(UnconnectedLogoutCallback);
