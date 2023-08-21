import React from "react";

import Twitter from "./Twitter";
import Facebook from "./Facebook";

const SocialBar = () => (
  // TODO: Make these customizable?
  <div className="social-bar">
    <Twitter />
    <Facebook />
  </div>
)


export default SocialBar;
