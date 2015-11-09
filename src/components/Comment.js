import React from 'react';
import {injectIntl, FormattedRelative} from 'react-intl';

class Comment extends React.Component {
  render() {
    const {data} = this.props;
    return (<div className="hearing-comment">
      <p>
        <i className="fa fa-user"/> {data.created_by || "-"}
        <i className="fa fa-clock-o"/> <FormattedRelative value={data.created_at}/>
      </p>
      <p>{data.content}</p>
      <hr/>
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object
};

export default injectIntl(Comment);
