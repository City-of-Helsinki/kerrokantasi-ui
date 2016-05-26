import React from 'react';
import {FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Icon from 'utils/Icon';
import CommentDisclaimer from './CommentDisclaimer';

class BaseCommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {collapsed: true, commentText: ""};
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

  clearCommentText() {
    this.setState({commentText: ""});
  }

  submitComment() {
    let pluginData = this.getPluginData();
    if (pluginData && typeof pluginData !== "string") {
      pluginData = JSON.stringify(pluginData);
    }
    this.props.onPostComment(
      this.state.commentText,
      pluginData
    );
  }

  getPluginData() {
    return undefined;
  }

  render() {
    if (!this.state.collapsed) {
      return (<div className="comment-form">
        <form>
          <h3><FormattedMessage id="writeComment"/></h3>
          <Input type="textarea" value={this.state.commentText} onChange={this.handleTextChange.bind(this)}/>
          <div className="comment-buttons clearfix">
            <Button bsStyle="warning" onClick={this.toggle.bind(this)}>
              <FormattedMessage id="cancel"/>
            </Button>
            <Button bsStyle="primary" className="pull-right" onClick={this.submitComment.bind(this)}>
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
  onPostComment: React.PropTypes.func
};

BaseCommentForm.contextTypes = {
  store: React.PropTypes.object,  // See `componentDidMount`.
};

export default BaseCommentForm;
