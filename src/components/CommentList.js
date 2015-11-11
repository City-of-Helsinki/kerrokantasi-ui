import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from './Comment';
import CommentForm from './CommentForm';

class CommentList extends React.Component {
  render() {
    const {comments, areCommentsOpen} = this.props;
    if (comments.length === 0) {
      return (<div>
        <h2><FormattedMessage id="comments"/></h2>
        {areCommentsOpen ? <CommentForm/> : null}
        <p><FormattedMessage id="noCommentsAvailable"/></p>
      </div>);
    }
    return (<div>
      <h2><FormattedMessage id="comments"/></h2>
      {areCommentsOpen ? <CommentForm/> : null}
      {comments.map((comment) => <Comment data={comment} key={comment.id}/>)}
    </div>);
  }
}

CommentList.propTypes = {
  comments: React.PropTypes.array,
  areCommentsOpen: React.PropTypes.bool
};

export default injectIntl(CommentList);
