import React from "react";
import Twitter from "./Twitter";
import Facebook from "./Facebook";

export default class SocialBar extends React.Component {
  render() {
    return (
      // TODO: Make these customizable?
      <div className="social-bar">
        <Twitter/>
        <Facebook/>
      </div>
    );
  }
}
