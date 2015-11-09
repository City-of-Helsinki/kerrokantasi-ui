import React from 'react';

export default class Comment extends React.Component {
  render() {
    const {data} = this.props;
    return (<div className="hearing-comment">
      <p>{data.content}</p>
      <hr/>
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object
};
