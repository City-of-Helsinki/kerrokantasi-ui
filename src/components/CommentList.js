import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import {Button} from 'react-bootstrap';
import sortBy from 'lodash/sortBy';
import Icon from '../utils/Icon';
import Comment from './Comment';
import CommentForm from './CommentForm';
import MapdonKSVPlugin from './plugins/legacy/mapdon-ksv';

const DEFAULT_COMMENT_COUNT = 10;

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxCommentCount: DEFAULT_COMMENT_COUNT
    };
  }

  renderPluginContent(section) {
    const {comments} = this.props;
    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return null;
    }
    switch (section.plugin_identifier) {
      case "mapdon-ksv":
        return (
          <div>
            <MapdonKSVPlugin
              data={section.plugin_data}
              pluginPurpose="viewComments"
              comments={comments}
            />
            <div className="image-caption">Kaikki annetut kommentit sekä siirretyt ja lisätyt asemat kartalla.</div>
            <MapdonKSVPlugin
              data={section.plugin_data}
              pluginPurpose="viewHeatmap"
              comments={comments}
            />
            <div className="image-caption">Siirrettyjen ja lisättyjen asemien tiheyskartta.</div>
          </div>
        );
      default:
        return null; // The plugin does not support result visualization.
    }
  }

  render() {
    const {section, comments, canComment, hearingId, displayVisualization} = this.props;
    const {maxCommentCount} = this.state;
    const title = (<h2><FormattedMessage id="comments"/>
      <div className="commenticon">
        <Icon name="comment-o"/>&nbsp;{comments.length}
      </div></h2>);
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
      {sortBy(comments, [
        (comment) => -comment.n_votes,
        (comment) => -(new Date(comment.created_at).getTime())
      ]).slice(0, maxCommentCount).map((comment) =>
        <Comment
          data={comment}
          key={comment.id}
          onEditComment={this.props.onEditComment}
          onDeleteComment={this.props.onDeleteComment}
          onPostVote={this.props.onPostVote}
          canVote={this.props.canVote}
        />
      )}
      <div className="commentlist__load-more">
        <p>
          <FormattedMessage
            id="commentsOutOf"
            values={{
              current: maxCommentCount < comments.length ? maxCommentCount : comments.length,
              total: comments.length
            }}
          />
        </p>
        {
          maxCommentCount < comments.length &&
          <Button
            bsStyle="link"
            onClick={
              () => this.setState({maxCommentCount: this.state.maxCommentCount + DEFAULT_COMMENT_COUNT})
            }
          >
            <FormattedMessage id="loadMoreComments"/>
          </Button>
        }
      </div>
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
  canSetNickname: React.PropTypes.bool
};

export default injectIntl(CommentList);
