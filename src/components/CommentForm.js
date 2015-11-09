import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';

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
      return (<form>
        <label><FormattedMessage id="content"/></label>
        <p>
          <textarea name="commentText"/>
        </p>
        <p>
          <Button onClick={this.toggle.bind(this)}><FormattedMessage id="cancel" /></Button> <Button><FormattedMessage id="submit"/></Button>
        </p>

      </form>);
    }
    return (<Button onClick={this.toggle.bind(this)}>
      <FormattedMessage id="addComment"/>
    </Button>);
  }
}

export default injectIntl(CommentForm);
