import React from "react";
import { CallbackComponent } from "redux-oidc";
import userManager from "../../utils/userManager";
import { push} from "react-router-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class CallbackPage extends React.Component {
  success = () => {
    this.props.dispatch(push("/"));
  };

  failure = () => {
    this.props.dispatch(push("/"));
  };

  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.success}
        errorCallback={this.failure}
      >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

CallbackPage.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(CallbackPage);
