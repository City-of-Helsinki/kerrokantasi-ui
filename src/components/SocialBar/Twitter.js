import React from "react";
import {Share} from 'react-twitter-widgets';

export default class Twitter extends React.Component {
  render() {
    return <div style={{marginRight: '8px'}}><Share className="twitter-tweet-ctr" url={window.location.href} /></div>; // <span ref="container" className="twitter-tweet-ctr" id={"twitter-" + this.state.id}/>;
  }
}
