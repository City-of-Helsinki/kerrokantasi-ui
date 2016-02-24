import React from 'react';
import {FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Icon from 'utils/Icon';

class BaseCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true, commentText: ""};
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  handleTextChange(event) {
    this.setState({commentText: event.target.value});
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
          <Input type="textarea" onChange={this.handleTextChange.bind(this)}/>
          <p>
            <Button bsStyle="primary" onClick={this.submitComment.bind(this)}>
              <FormattedMessage id="submit"/>
            </Button>
            <Button onClick={this.toggle.bind(this)}>
              <FormattedMessage id="cancel"/>
            </Button>
          </p>
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

export default BaseCommentForm;
