import React from 'react';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';

class Comment extends React.Component {
  onVote() {
    const {data} = this.props;
    this.props.onPostVote(data.id);
  }
  render() {
    const {data, canVote} = this.props;
    return (<div className="hearing-comment">
      <p>
        <span className="pull-right"><i className="fa fa-thumbs-o-up"/> {data.n_votes}</span>
        <i className="fa fa-clock-o"/> <FormattedRelative value={data.created_at}/><br/>
        <i className="fa fa-user"/> {data.created_by.username || "-"}
      </p>
      <hr/>
      <p>{data.content}</p>
      {canVote ? <Button bsStyle="primary" onClick={this.onVote.bind(this)}><FormattedMessage id="vote"/> <i className="fa fa-thumbs-o-up" /></Button> : null}
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object,
  canVote: React.PropTypes.bool,
  onPostVote: React.PropTypes.function,
};

export default injectIntl(Comment);
