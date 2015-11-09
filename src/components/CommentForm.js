import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';

class CommentForm extends React.Component {
  render() {
    return (<Button>
      <FormattedMessage id="add-comment"/>
    </Button>);
  }
}

export default injectIntl(CommentForm);
