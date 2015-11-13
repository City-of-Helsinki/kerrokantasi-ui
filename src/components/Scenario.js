import React from 'react';
import CommentList from './CommentList';

export default class Scenario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  onPostComment(text) {
    const {data} = this.props;
    this.props.onPostComment(data.id, text);
  }

  toggle() {
    if (this.state.collapsed === true) {
      this.loadComments();
    }

    this.setState({collapsed: !this.state.collapsed});
  }

  loadComments() {
    const {data} = this.props;
    this.props.loadScenarioComments(data.id);
  }

  render() {
    const {data} = this.props;
    if (this.state.collapsed) {
      return (<div className="hearing-scenario">
        <h3 className="scenario-title" onClick={this.toggle.bind(this)}><i className="fa fa-chevron-right"></i> {data.title}</h3>
        <hr/>
      </div>);
    }
    return (<div className="hearing-scenario">
      <h3 className="scenario-title" onClick={this.toggle.bind(this)}><i className="fa fa-chevron-down"></i> {data.title}</h3>
      <div className="scenario-content">
        {data.images.map((image) => <div key={image.url}><img className="img-responsive" alt={image.title} title={image.title} src={image.url} /><div className="image-caption">{image.caption}</div></div>)}
        <p>{data.abstract}</p>
        <p>{data.content}</p>
      </div>
      <CommentList
       comments={this.props.comments.data}
       canComment={this.props.canComment}
       onPostComment={this.onPostComment.bind(this)}
       canVote={this.props.canVote}
       onPostVote={this.props.onPostVote}
      />
    <hr/>
    </div>);
  }
}

Scenario.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  data: React.PropTypes.object,
  onPostComment: React.PropTypes.function,
  onPostVote: React.PropTypes.function,
  loadScenarioComments: React.PropTypes.function,
  comments: React.PropTypes.object,
};
