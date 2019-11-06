import React from "react";
import { connect } from "react-redux";
import {processSilentRenew} from "redux-oidc";

class SilentRenew extends React.Component {
  componentDidMount() {
    processSilentRenew();
  }

  render() {
    return (
      <div>Silent Renew</div>
    );
  }
}

export default connect()(SilentRenew);
