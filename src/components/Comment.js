import React from 'react';
import {injectIntl, FormattedRelative} from 'react-intl';

class Comment extends React.Component {
  render() {
    const {data} = this.props;
    return (<div className="hearing-comment">
      <p>
        <span className="pull-right"><i className="fa fa-thumbs-o-up"/> {data.n_votes}</span>
        <i className="fa fa-clock-o"/> <FormattedRelative value={data.created_at}/><br/>
        <i className="fa fa-user"/> {data.created_by || "-"}
      </p>
      <hr/>
      <p>{data.content}</p>
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object
};

export default injectIntl(Comment);
