/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/no-string-refs */
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { alert } from '../../../utils/notify';
import CommentDisclaimer from '../../CommentDisclaimer';
import { BaseCommentForm } from '../../BaseCommentForm';

class MapdonHKRPlugin extends BaseCommentForm {
  constructor(props) {
    super(props);
    this.pluginInstanceId = `hkr${0 | (Math.random() * 10000000)}`; // eslint-disable-line no-bitwise
    this.userDataChanged = false;
    this.lastUserData = null;
    this.submitting = false;
  }

  render() {
    const buttonDisabled = this.submitting;
    return (
      <div className='plugin-comment-form mapdon-hkr-plugin-comment-form'>
        <form>
          <iframe
            src='/assets/mapdon-hkr/plugin-inlined.html'
            className='plugin-frame mapdon-hkr-plugin-frame'
            ref='frame'
          />
          <br />
          <FormGroup>
            <FormControl
              componentClass='textarea'
              onChange={this.handleTextChange}
              placeholder='Kommentoi ehdotustasi tässä.'
            />
          </FormGroup>
          <p>
            <Button bsStyle='primary' onClick={this.getDataAndSubmitComment} disabled={buttonDisabled}>
              Lähetä ehdotus
            </Button>
          </p>
          <CommentDisclaimer />
        </form>
      </div>
    );
  }

  sendMessageToPluginFrame(message) {
    this.refs.frame.contentWindow.postMessage(message, '*');
  }

  requestData() {
    this.sendMessageToPluginFrame({
      message: 'getUserData',
      instanceId: this.pluginInstanceId,
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

    if (payload.message === 'userDataChanged') {
      this.userDataChanged = true;
    }

    if (payload.message === 'userData') {
      this.lastUserData = payload.data;
      if (this.submitting) {
        this.submitting = false;
        if (this.lastUserData) {
          this.submitComment();
        } else {
          alert('Et muuttanut mitään kartassa.');
        }
      }
    }
  }

  componentDidMount() {
    const iframe = this.refs.frame;
    const { data } = this.props;
    const self = this;
    if (!self._messageListener) {
      self._messageListener = this.onReceiveMessage.bind(self);
      if (typeof window !== 'undefined') window.addEventListener('message', self._messageListener, false);
    }

    iframe.addEventListener(
      'load',
      () => {
        self.sendMessageToPluginFrame({
          message: 'mapData',
          data,
          instanceId: self.pluginInstanceId,
        });
      },
      false,
    );
  }

  componentWillUnmount() {
    if (this._messageListener) {
      if (typeof window !== 'undefined') window.removeEventListener('message', this._messageListener, false);
      this._messageListener = null;
    }
  }
}

MapdonHKRPlugin.propTypes = {
  onPostComment: PropTypes.func,
  data: PropTypes.string,
};

export default injectIntl(MapdonHKRPlugin);
