import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Comment from './Comment';

class CommentList extends React.Component {
  render() {
    const {section, comments, canComment, displayVisualization, isLoading} = this.props;
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
        <p><FormattedMessage id="noCommentsAvailable"/></p>
      </div>);
    }
    return (<div className="commentlist">
      {pluginContent}
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
  onEditComment: React.PropTypes.func,
  onDeleteComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  isLoading: React.PropTypes.bool
};

export default injectIntl(CommentList);
