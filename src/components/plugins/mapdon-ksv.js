import Button from 'react-bootstrap/lib/Button';
import {MapdonHKRPlugin} from './mapdon-hkr';
import CommentDisclaimer from "../CommentDisclaimer";
import Input from 'react-bootstrap/lib/Input';
import React from 'react';
import {injectIntl} from 'react-intl';


class MapdonKSVPlugin extends MapdonHKRPlugin {
  constructor(props) {
    super(props);
    this.pluginInstanceId = "ksv" + (0 | (Math.random() * 10000000));
  }

  render() {
    const buttonDisabled = (this.submitting);
    const pluginPurpose = this.props.pluginPurpose;
    const commentBox = (
      <div>
        <br/>
        <Input
          type="textarea"
          onChange={this.handleTextChange.bind(this)}
          placeholder="Kommentoi ehdotustasi tässä."
        />
        <p>
          <Button bsStyle="primary" onClick={this.getDataAndSubmitComment.bind(this)} disabled={buttonDisabled}>
            Lähetä ehdotus
          </Button>
        </p>
        <CommentDisclaimer/>
      </div>
    );
    return (
      <div className="plugin-comment-form mapdon-ksv-plugin-comment-form">
        <form>
          <iframe
            src="/assets/mapdon-ksv/plugin-inline.html"
            className="plugin-frame mapdon-ksv-plugin-frame"
            ref="frame"
          ></iframe>
          {pluginPurpose === 'postComments' ? commentBox : null}
        </form>
      </div>
    );
  }

  onReceiveMessage(event) {
    const pluginPurpose = this.props.pluginPurpose;
    // override user messages if in visualization mode
    if (pluginPurpose !== 'postComments') {
      return;
    }
    super.onReceiveMessage(event);
  }

  componentDidMount() {
    const iframe = this.refs.frame;
    const {data, pluginPurpose} = this.props;
    let {comments} = this.props;
    if (!comments) {
      comments = [];
    }
    if (!this._messageListener) {
      this._messageListener = this.onReceiveMessage.bind(this);
      window.addEventListener("message", this._messageListener, false);
    }

    iframe.addEventListener("load", () => {
      this.sendMessageToPluginFrame({
        message: "mapData",
        data,
        pluginPurpose,
        comments,
        instanceId: this.pluginInstanceId
      });
    }, false);
  }

  componentWillUpdate() {
    const {data, pluginPurpose} = this.props;
    let {comments} = this.props;
    if (!comments) {
      comments = [];
    }
    // do not redraw plugin contents if user has interacted with the plugin!
    if (!this.userDataChanged) {
      this.sendMessageToPluginFrame({
        message: "mapData",
        data,
        pluginPurpose,
        comments,
        instanceId: this.pluginInstanceId
      });
    }
  }
}

MapdonKSVPlugin.propTypes = {
  onPostComment: React.PropTypes.func,
  data: React.PropTypes.string,
  pluginPurpose: React.PropTypes.string,
  comments: React.PropTypes.object
};

export default injectIntl(MapdonKSVPlugin);
