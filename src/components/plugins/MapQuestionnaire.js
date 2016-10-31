import Button from 'react-bootstrap/lib/Button';
import BaseCommentForm from '../BaseCommentForm';
import CommentDisclaimer from "../CommentDisclaimer";
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import {alert} from '../../utils/notify';


class MapQuestionnaire extends BaseCommentForm {
  constructor(props) {
    super(props);
    this.pluginInstanceId = "map" + (0 | (Math.random() * 10000000));
    this.state = Object.assign(this.state, {userDataChanged: false});
    this.lastUserData = null;
    this.lastUserComment = null;
    this.submitting = false;
    this.comments = props.comments;
    if (!this.comments) {
      this.comments = [];
    }
  }

  render() {
    const canSetNickname = this.props.canSetNickname;
    const buttonDisabled = this.submitting || (!this.state.commentText && !this.state.userDataChanged);
    const pluginPurpose = this.props.pluginPurpose;
    const displayCommentBox = this.props.displayCommentBox;
    const pluginSource = this.props.pluginSource;
    const commentBox = (
      <div>
        <br/>
        <FormGroup>
          <FormControl
            componentClass="textarea"
            onChange={this.handleTextChange.bind(this)}
            value={this.state.commentText}
            placeholder="Kommentoi ehdotustasi tässä."
          />
        </FormGroup>
        {canSetNickname ? <h3><FormattedMessage id="nickname"/></h3> : null}
        {canSetNickname ? (
          <FormGroup>
            <FormControl
              type="text"
              placeholder={this.props.intl.formatMessage({id: "anonymous"})}
              value={this.state.nickname}
              onChange={this.handleNicknameChange.bind(this)}
              maxLength={32}
            />
          </FormGroup>
        ) : null}
        <p>
          <Button bsStyle="primary" onClick={this.getDataAndSubmitComment.bind(this)} disabled={buttonDisabled}>
            Lähetä ehdotus
          </Button>
        </p>
        <CommentDisclaimer/>
      </div>
    );
    return (
      <div className="plugin-comment-form map-plugin-comment-form">
        <form>
          <iframe
            src={pluginSource}
            className="plugin-frame map-plugin-frame"
            ref="frame"
          ></iframe>
          {pluginPurpose === 'postComments' && displayCommentBox ? commentBox : null}
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

  getPluginComment() {
    return this.lastUserComment;
  }

  submitVote(commentId) {
    this.props.onPostVote(commentId);
  }

  onReceiveMessage(event) {
    const pluginPurpose = this.props.pluginPurpose;
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

    if (payload.message === "userDataChanged") {
      this.setState({userDataChanged: true});
    }

    if (payload.message === "userData") {
      this.lastUserComment = payload.comment;
      // whenever user data is sent by the plugin, post it no questions asked
      this.submitting = false;
      if (this.lastUserComment) {
        this.submitComment();
      } else {
        alert("Et muuttanut mitään kartassa.");
      }
    }

    if (payload.message === "userVote") {
      const commentToVote = payload.comment_id;
      this.submitVote(commentToVote);
    }
  }

  clearCommentText() {
    // after successful posting, user data shall be decimated from the map
    this.setState({userDataChanged: false});
    super.clearCommentText();
  }

  componentDidMount() {
    super.componentDidMount();
    const {comments} = this.props;
    if (comments) {
      this.comments = comments;
    }
    if (!this._messageListener) {
      this._messageListener = this.onReceiveMessage.bind(this);
      window.addEventListener("message", this._messageListener, false);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this._messageListener) {
      window.removeEventListener("message", this._messageListener, false);
      this._messageListener = null;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const {data, pluginPurpose} = this.props;
    const {comments} = nextProps;
    if (comments) {
      this.comments = comments;
    }
    // do not redraw plugin contents if user has interacted with the plugin!
    if (!nextState.userDataChanged) {
      this.sendMessageToPluginFrame({
        message: "mapData",
        data,
        pluginPurpose,
        comments: this.comments,
        instanceId: this.pluginInstanceId
      });
    }
  }
}

MapQuestionnaire.propTypes = {
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  data: React.PropTypes.string,
  pluginPurpose: React.PropTypes.string,
  comments: React.PropTypes.array,
  canSetNickname: React.PropTypes.bool,
  displayCommentBox: React.PropTypes.bool,
  pluginSource: React.PropTypes.string
};

export default injectIntl(MapQuestionnaire);
