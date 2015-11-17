import React from "react";
import {loadScriptThenCall} from "./utils";

export default class Twitter extends React.Component {
  componentWillMount() {
    this.setState({id: Math.random().toString(36)});
  }

  componentDidMount() {
    const setup = this.setupTwitterWidget.bind(this);
    loadScriptThenCall("twitter-wjs", "//platform.twitter.com/widgets.js", "twttr", setup);
  }

  setupTwitterWidget(twttr) {
    twttr.widgets.createShareButton(window.location.href, this.refs.container, {});
  }

  render() {
    return <span ref="container" className="twitter-tweet-ctr" id={"twitter-" + this.state.id}/>;
  }
}
