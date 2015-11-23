import React from 'react';
import CommentList from './CommentList';

export default class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true, commentLoaded: false};
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.collapsed && !nextState.commentLoaded) {
      this.loadComments();
      this.setState({commentLoaded: true});
    }
  }

  onPostComment(text) {
    const {data} = this.props;
    this.props.onPostComment(data.id, text);
  }

  onPostVote(commentId) {
    const {data} = this.props;
    this.props.onPostVote(commentId, data.id);
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  loadComments() {
    const {data} = this.props;
    this.props.loadSectionComments(data.id);
  }

  render() {
    const {data} = this.props;
    if (this.state.collapsed) {
      return (<div className="hearing-section">
        <h3 className="section-title" onClick={this.toggle.bind(this)}><i className="fa fa-chevron-right"></i> {data.title}</h3>
        <hr/>
      </div>);
    }
    return (<div className="hearing-section">
      <h3 className="section-title" onClick={this.toggle.bind(this)}><i className="fa fa-chevron-down"></i> {data.title}</h3>
      <div className="section-content">
        {data.images.map((image) => <div key={image.url}><img className="img-responsive" alt={image.title} title={image.title} src={image.url} /><div className="image-caption">{image.caption}</div></div>)}
        <p>{data.abstract}</p>
        <p>{data.content}</p>
      </div>
      <CommentList
       comments={this.props.comments.data}
       canComment={this.props.canComment}
       onPostComment={this.onPostComment.bind(this)}
       canVote={this.props.canVote}
       onPostVote={this.onPostVote.bind(this)}
      />
    <hr/>
    </div>);
  }
}

Section.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  data: React.PropTypes.object,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  loadSectionComments: React.PropTypes.func,
  comments: React.PropTypes.object,
};
