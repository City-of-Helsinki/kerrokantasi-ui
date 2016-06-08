import React from 'react';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Icon from 'utils/Icon';

class Comment extends React.Component {
  onVote() {
    const {data} = this.props;
    this.props.onPostVote(data.id, data.section);
  }

  render() {
    const {data, canVote} = this.props;
    const voteButton = (canVote ?
        <Button className="btn-sm hearing-comment-vote-link" onClick={this.onVote.bind(this)}>
          <Icon name="thumbs-o-up"/> <FormattedMessage id="vote"/>
        </Button> : null
    );
    const authorName = data.author_name || (data.created_by ? data.created_by.username : null);
    if (!data.content) {
      return null;
    }

    return (<div className="hearing-comment">
      <div className="hearing-comment-header clearfix">
        <div className="hearing-comment-votes">
          <Icon name="thumbs-o-up"/> {data.n_votes}
        </div>
        <div className="hearing-comment-publisher">
          <span className="hearing-comment-user">{authorName || <FormattedMessage id="anonymous"/>}</span>
          <span className="hearing-comment-date"><FormattedRelative value={data.created_at}/></span>
        </div>
      </div>
      <div className="hearing-comment-body">
        <p>{data.content}</p>
        {voteButton}
      </div>
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object,
  canVote: React.PropTypes.bool,
  onPostVote: React.PropTypes.func,
};

export default injectIntl(Comment);
