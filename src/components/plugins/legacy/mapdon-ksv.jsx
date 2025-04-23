/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-underscore-dangle */
import { Button, TextArea } from 'hds-react';
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import { alert } from '../../../utils/notify';
import CommentDisclaimer from '../../CommentDisclaimer';
import BaseCommentForm from '../../BaseCommentForm';

class MapdonKSVPlugin extends BaseCommentForm {
  constructor(props) {
    super(props);
    this.pluginInstanceId = `ksv${Math.random() * 10000000}`;
    this.state = Object.assign(this.state, { userDataChanged: false });
    this.lastUserData = null;
    this.submitting = false;

    this.iframeRef = createRef();
  }

  componentDidMount() {
    const iframe = this.refs.frame;
    const { data, pluginPurpose } = this.props;
    let { comments } = this.props;
    if (!comments) {
      comments = [];
    }
    if (!this._messageListener) {
      this._messageListener = this.onReceiveMessage;
      if (typeof window !== 'undefined') window.addEventListener('message', this._messageListener, false);
    }

    iframe.addEventListener(
      'load',
      () => {
        this.sendMessageToPluginFrame({
          message: 'mapData',
          data,
          pluginPurpose,
          comments,
          instanceId: this.pluginInstanceId,
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

  componentWillUpdate(nextProps, nextState) {
    const { data, pluginPurpose } = this.props;
    let { comments } = this.props;
    if (!comments) {
      comments = [];
    }
    // do not redraw plugin contents if user has interacted with the plugin!
    if (!nextState.userDataChanged) {
      this.sendMessageToPluginFrame({
        message: 'mapData',
        data,
        pluginPurpose,
        comments,
        instanceId: this.pluginInstanceId,
      });
    }
  }

  render() {
    const buttonDisabled = this.submitting || (!this.state.commentText && !this.state.userDataChanged);
    const { pluginPurpose } = this.props;
    const commentBox = (
      <div>
        <br />
        <TextArea
          id='comment-suggestion'
          label={<FormattedMessage id='writeComment' />}
          placeholder='Kommentoi ehdotustasi tässä.'
          value={this.state.commentText}
          onChange={this.handleTextChange}
          style={{ marginBottom: 'var(--spacing-s)' }}
        />
        <p>
          <Button className='kerrokantasi-btn' onClick={this.getDataAndSubmitComment} disabled={buttonDisabled}>
            Lähetä ehdotus
          </Button>
        </p>
        <CommentDisclaimer />
      </div>
    );
    return (
      <div className='plugin-comment-form mapdon-ksv-plugin-comment-form'>
        <form>
          <iframe
            src='/assets/mapdon-ksv/plugin-inline.html'
            className='plugin-frame mapdon-ksv-plugin-frame'
            ref={this.iframeRef}
          />
          {pluginPurpose === 'postComments' ? commentBox : null}
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
    const { pluginPurpose } = this.props;
    // override user messages if in visualization mode
    if (pluginPurpose !== 'postComments') {
      return;
    }
    const payload = event.data;
    if (typeof payload === 'string') {
      return;
    }
    if (payload.instanceId !== this.pluginInstanceId) {
      return;
    }

    if (payload.message === 'userDataChanged') {
      this.setState({ userDataChanged: true });
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

  clearCommentText() {
    // after successful posting, user data shall be decimated from the map
    this.setState({ userDataChanged: false });
    super.clearCommentText();
  }
}

MapdonKSVPlugin.propTypes = {
  data: PropTypes.string,
  pluginPurpose: PropTypes.string,
  comments: PropTypes.array,
  defaultNickname: PropTypes.string,
  nicknamePlaceholder: PropTypes.string,
};

export default injectIntl(MapdonKSVPlugin);
