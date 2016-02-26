import Button from 'react-bootstrap/lib/Button';
import BaseCommentForm from '../BaseCommentForm';
import Input from 'react-bootstrap/lib/Input';
import React from 'react';
import {injectIntl} from 'react-intl';
import {alert} from '../../utils/notify';


class MapdonHKRPlugin extends BaseCommentForm {
  constructor(props) {
    super(props);
    this.pluginInstanceId = "hkr" + (0 | (Math.random() * 10000000));
    this.userDataChanged = false;
    this.lastUserData = null;
    this.submitting = false;
  }

  render() {
    const buttonDisabled = (this.submitting || this.state.commentText.length < 2);
    return (
      <div className="plugin-comment-form mapdon-hkr-plugin-comment-form">
        <form>
          <iframe
            src="/assets/mapdon-hkr/plugin-inlined.html"
            className="plugin-frame mapdon-hkr-plugin-frame"
            ref="frame"
          ></iframe>
          <br/>
          <Input type="textarea" onChange={this.handleTextChange.bind(this)}
                 placeholder="Kommentoi ehdotustasi tässä."/>
          <p>
            <Button bsStyle="primary" onClick={this.getDataAndSubmitComment.bind(this)} disabled={buttonDisabled}>
              Lähetä ehdotus
            </Button>
          </p>
        </form>
      </div>
    );
  }

  sendMessageToPluginFrame(message) {
    this.refs.frame.contentWindow.postMessage(message, "*");
  }

  requestData() {
    this.sendMessageToPluginFrame({
      message: "getUserData",
      instanceId: this.pluginInstanceId
    });
  }

  getDataAndSubmitComment() {
    this.submitting = true;
    this.requestData();
  }

  getPluginData() {
    return this.lastUserData;
  }


  onReceiveMessage(event) {
    const payload = event.data;
    if (typeof payload === 'string') {
      return;
    }
    if (payload.instanceId !== this.pluginInstanceId) {
      return;
    }

    if (payload.message === "userDataChanged") {
      this.userDataChanged = true;
    }

    if (payload.message === "userData") {
      this.lastUserData = payload.data;
      if (this.submitting) {
        this.submitting = false;
        if (this.lastUserData) {
          this.submitComment();
        } else {
          alert("Et muuttanut mitään kartassa.");
        }
      }
    }
  }

  componentDidMount() {
    const iframe = this.refs.frame;
    const data = this.props.data;
    const self = this;
    if (!self._messageListener) {
      self._messageListener = this.onReceiveMessage.bind(self);
      window.addEventListener("message", self._messageListener, false);
    }

    iframe.addEventListener("load", function loadEvent() {
      self.sendMessageToPluginFrame({
        message: "mapData",
        data: data,
        instanceId: self.pluginInstanceId
      });
    }, false);
  }

  componentWillUnmount() {
    if (this._messageListener) {
      window.removeEventListener("message", this._messageListener, false);
      this._messageListener = null;
    }
  }
}

MapdonHKRPlugin.propTypes = {
  onPostComment: React.PropTypes.func,
  data: React.PropTypes.string
};

export default injectIntl(MapdonHKRPlugin);
