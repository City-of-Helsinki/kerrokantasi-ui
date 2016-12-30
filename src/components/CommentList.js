import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from './Comment';
import CommentForm from './CommentForm';

class CommentList extends React.Component {
  render() {
    const {section, comments, canComment, hearingId, displayVisualization, isLoading} = this.props;
    const commentButton = (
      canComment ? (
        <CommentForm
          hearingId={hearingId}
          onPostComment={this.props.onPostComment}
          canSetNickname={this.props.canSetNickname}
        />
      ) : null
    );
    const pluginContent = (
      displayVisualization ?
        this.renderPluginContent(section)
        : null
    );
    if (comments.length === 0) {
      if (!canComment || isLoading) {
        return null;  // No need to show a header for nothing at all.
      }
      return (<div className="commentlist">
        {commentButton}
        <p><FormattedMessage id="noCommentsAvailable"/></p>
      </div>);
    }
    return (<div className="commentlist">
      {pluginContent}
      {commentButton}
      {comments.map((comment) =>
        <Comment
          data={comment}
          onEditComment={this.props.onEditComment}
          onDeleteComment={this.props.onDeleteComment}
          key={comment.id + Math.random()}
          onPostVote={this.props.onPostVote}
          canVote={this.props.canVote}
        />
      )}
    </div>);
  }
}

CommentList.propTypes = {
  displayVisualization: React.PropTypes.bool,
  section: React.PropTypes.object,
  comments: React.PropTypes.array,
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  hearingId: React.PropTypes.string,
  onPostComment: React.PropTypes.func,
  onEditComment: React.PropTypes.func,
  onDeleteComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  canSetNickname: React.PropTypes.bool,
  isLoading: React.PropTypes.bool
};

export default injectIntl(CommentList);
