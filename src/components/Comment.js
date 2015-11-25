import React from 'react';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Icon from 'utils/Icon';

class Comment extends React.Component {
  onVote() {
    const {data} = this.props;
    this.props.onPostVote(data.id);
  }

  render() {
    const {data, canVote} = this.props;
    const createdBy = data.created_by;
    const voteButton = (canVote ?
        <Button bsStyle="primary" onClick={this.onVote.bind(this)}>
          <FormattedMessage id="vote"/> <Icon name="thumbs-o-up"/>
        </Button> : null
    );
    return (<div className="hearing-comment">
      <p>
        <span className="pull-right"><Icon name="thumbs-o-up"/> {data.n_votes}</span>
        <Icon name="clock-o"/> <FormattedRelative value={data.created_at}/><br/>
        <Icon name="user"/> {createdBy ? createdBy.username : <FormattedMessage id="anonymous"/>}
      </p>
      <hr/>
      <p>{data.content}</p>
      {voteButton}
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object,
  canVote: React.PropTypes.bool,
  onPostVote: React.PropTypes.func,
};

export default injectIntl(Comment);
