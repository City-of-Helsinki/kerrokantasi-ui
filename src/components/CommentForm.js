import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    if (!this.state.collapsed) {
      return (<div className="comment-form"><form>
          <h3><FormattedMessage id="writeComment"/></h3>
          <Input type="textarea"/>
          <p>
            <Button bsStyle="primary"><FormattedMessage id="submit"/></Button> <Button onClick={this.toggle.bind(this)}><FormattedMessage id="cancel"/></Button>
          </p>
        </form>
      </div>);
    }
    return (<Button onClick={this.toggle.bind(this)} bsStyle="primary">
      <i className="fa fa-comment-o"/> <FormattedMessage id="addComment"/>
    </Button>);
  }
}

export default injectIntl(CommentForm);
