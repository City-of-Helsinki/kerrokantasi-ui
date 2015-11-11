import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from './Comment';
import CommentForm from './CommentForm';

class CommentList extends React.Component {
  render() {
    const {comments, areCommentsOpen, hearingId} = this.props;
    if (comments.length === 0) {
      return (<div>
        <h2><FormattedMessage id="comments"/></h2>
        {areCommentsOpen ? <CommentForm hearingId={hearingId} /> : null}
        <p><FormattedMessage id="noCommentsAvailable"/></p>
      </div>);
    }
    return (<div>
      <h2><FormattedMessage id="comments"/></h2>
      {areCommentsOpen ? <CommentForm hearingId={hearingId}/> : null}
      {comments.map((comment) => <Comment data={comment} key={comment.id}/>)}
    </div>);
  }
}

CommentList.propTypes = {
  comments: React.PropTypes.array,
  areCommentsOpen: React.PropTypes.bool,
  hearingId: React.PropTypes.string
};

export default injectIntl(CommentList);
