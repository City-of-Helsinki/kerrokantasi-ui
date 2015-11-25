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
    this.props.onPostComment(section.id, text);
  }

  onPostVote(commentId) {
    const {section} = this.props;
    this.props.onPostVote(commentId, section.id);
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  loadComments() {
    const {section} = this.props;
    this.props.loadSectionComments(section.id);
  }

  getTitleDiv(collapsed) {
    const {section} = this.props;
    if(section.type === "introduction") { // Intros never render this
      return null;
    }
    const iconClass = (collapsed ? "fa-chevron-right" : "fa-chevron-down");
    return (
      <h3 className="section-title" onClick={this.toggle.bind(this)}>
        <i className={"fa " + iconClass} /> {this.props.section.title}
      </h3>
    );
  }

  render() {
    const {section} = this.props;
    const collapsed = this.state.collapsed && (section.type !== "introduction");
    const titleDiv = this.getTitleDiv(collapsed);
    if (collapsed) {
      return (<div className="hearing-section">
        {titleDiv}
        <div className="section-abstract" dangerouslySetInnerHTML={{__html: section.abstract}}></div>
        <hr/>
      </div>);
    }
    var commentList = null;
    if (section.type !== "introduction" && section.commenting !== "none") {
      commentList = <CommentList
        comments={this.props.comments.data}
        canComment={this.props.canComment}
        onPostComment={this.onPostComment.bind(this)}
        canVote={this.props.canVote}
        onPostVote={this.onPostVote.bind(this)}
      />;
    }
    const imageList = section.images.map((image) => <div key={image.url}>
      <img className="img-responsive" alt={image.title} title={image.title} src={image.url} />
      <div className="image-caption">{image.caption}</div>
    </div>);
    return (<div className="hearing-section">
      {titleDiv}
      <div className="section-content">
        {imageList}
        <div dangerouslySetInnerHTML={{__html: section.abstract}}></div>
        <div dangerouslySetInnerHTML={{__html: section.content}}></div>
      </div>
      {commentList}
      <hr/>
    </div>);
  }
}

Section.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  section: React.PropTypes.object.isRequired,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  loadSectionComments: React.PropTypes.func,
  comments: React.PropTypes.object,
};
