import React from 'react';
import {intlShape, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Icon from 'utils/Icon';
import CommentDisclaimer from './CommentDisclaimer';

class BaseCommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {collapsed: true, commentText: "", nickname: ""};
  }

  componentDidMount() {
    const store = this.context.store;
    if (store) {
      /*
      This is slightly dark magic that sidesteps the usual rules of
      Redux componentry, but I sincerely believe this is for the better.
      (The alternative would be to store the comment text in the global
       store, which seems very unnecessary, plus the cleanup of having to
       remember to empty the comment text from the global store when the user
       "leaves" the hearing view for another seems even more cumbersome.)

      Basically, this component subscribes to the state of the global store
      but ONLY to notice when the "postedComment" action has been dispatched,
      so it can modify its local state to clear the comment text.
      */
      this.unsubscribe = store.subscribe(() => {
        if (store.getState().lastActionType === "postedComment") {
          this.clearCommentText();
          this.toggle();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  handleTextChange(event) {
    this.setState({commentText: event.target.value});
  }

  handleNicknameChange(event) {
    this.setState({nickname: event.target.value});
  }

  clearCommentText() {
    this.setState({commentText: ""});
  }

  submitComment() {
    let pluginData = this.getPluginData();
    //TODO: allow plugin data to override comment fields, if provided!!!

    if (pluginData && typeof pluginData !== "string") {
      pluginData = JSON.stringify(pluginData);
    }
    const nickname = (this.state.nickname === "" ? null : this.state.nickname);
    this.props.onPostComment(
      this.state.commentText,
      nickname,
      pluginData
    );
  }

  getPluginData() {
    return undefined;
  }

  render() {
    const canSetNickname = this.props.canSetNickname;
    if (!this.state.collapsed) {
      return (<div className="comment-form">
        <form>
          <h3><FormattedMessage id="writeComment"/></h3>
          <FormControl
            componentClass="textarea"
            value={this.state.commentText}
            onChange={this.handleTextChange.bind(this)}
          />
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
          <div className="comment-buttons clearfix">
            <Button bsStyle="warning" onClick={this.toggle.bind(this)}>
              <FormattedMessage id="cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              disabled={!this.state.commentText}
              className="pull-right"
              onClick={this.submitComment.bind(this)}
            >
              <FormattedMessage id="submit"/>
            </Button>
          </div>
          <CommentDisclaimer/>
        </form>
      </div>);
    }
    return (<Button onClick={this.toggle.bind(this)} bsStyle="primary">
      <Icon name="comment"/> <FormattedMessage id="addComment"/>
    </Button>);
  }
}

BaseCommentForm.propTypes = {
  onPostComment: React.PropTypes.func,
  intl: intlShape.isRequired,
  canSetNickname: React.PropTypes.bool,
};

BaseCommentForm.contextTypes = {
  store: React.PropTypes.object,  // See `componentDidMount`.
};

export default BaseCommentForm;
