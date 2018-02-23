import React from "react";
import {loadScriptThenCall} from "./utils";

export default class Facebook extends React.Component {
  componentWillMount() {
    this.setState({id: Math.random().toString(36)});
  }

  componentDidMount() {
    const setup = this.setupFacebookWidget.bind(this);
    loadScriptThenCall("facebook-jssdk", "//connect.facebook.net/en_US/sdk.js", "FB", setup);
  }

  componentDidUpdate() {
    const setup = this.setupFacebookWidget.bind(this);
    loadScriptThenCall("facebook-jssdk", "//connect.facebook.net/en_US/sdk.js", "FB", setup);
  }

  setupFacebookWidget(FB) {
    FB.init({version: 'v2.4'});
    FB.XFBML.parse(this.refs.container);
  }

  render() {
    if (typeof window === "undefined") {
      // Unable to render this without a valid `window`
      return null;
    }
    return (
      <span ref="container" id={"facebook-" + this.state.id}>
        <div
          className="fb-share-button"
          data-href={window.location.href}
          data-layout="button_count"
        />
      </span>
    );
  }
}
