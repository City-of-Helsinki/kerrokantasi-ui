import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from './Comment';

class CommentList extends React.Component {
  render() {
    const {comments} = this.props;
    if (comments.length === 0) {
      return (<div>
        <h2><FormattedMessage id="comments"/></h2>
        <p><FormattedMessage id="no-comments"/></p>
      </div>);
    }
    return (<div>
      <h2><FormattedMessage id="comments"/></h2>
      {comments.map((comment) => <Comment data={comment} key={comment.id}/>)}
    </div>);
  }
}

CommentList.propTypes = {
  comments: React.PropTypes.array
};

export default injectIntl(CommentList);
