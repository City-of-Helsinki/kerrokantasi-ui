import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Icon from 'utils/Icon';
import Comment from './Comment';
import CommentForm from './CommentForm';
import MapdonKSVPlugin from './plugins/mapdon-ksv';

class CommentList extends React.Component {

  renderPluginContent(section) {
    const {comments} = this.props;
    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return null;
    }
    switch (section.plugin_identifier) {
      case "mapdon-ksv":
        return (
          <MapdonKSVPlugin
            data={section.plugin_data}
            canComment={false}
            comments={comments}
          />
        );
      default:
        return null; // The plugin does not support result visualization.
    }
  }

  render() {
    const {section, comments, canComment, hearingId} = this.props;
    const title = (<h2><FormattedMessage id="comments"/>
      <div className="commenticon">
        <Icon name="comment-o"/>&nbsp;{comments.length}
      </div></h2>);
    const commentButton = (
      canComment ?
        <CommentForm hearingId={hearingId} onPostComment={this.props.onPostComment}/>
        : null
    );
    const pluginContent = this.renderPluginContent(section);
    if (comments.length === 0) {
      if (!canComment) {
        return null;  // No need to show a header for nothing at all.
      }
      return (<div className="commentlist">
        {title}
        {commentButton}
        <p><FormattedMessage id="noCommentsAvailable"/></p>
      </div>);
    }
    return (<div className="commentlist">
      {title}
      {pluginContent}
      {commentButton}
      {comments.map((comment) =>
        <Comment
          data={comment}
          key={comment.id}
          onPostVote={this.props.onPostVote}
          canVote={this.props.canVote}
        />
      )}
    </div>);
  }
}

CommentList.propTypes = {
  section: React.PropTypes.object,
  comments: React.PropTypes.array,
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  hearingId: React.PropTypes.string,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func
};

export default injectIntl(CommentList);
