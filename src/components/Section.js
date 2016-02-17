import React from 'react';
import CommentList from './CommentList';
import Icon from 'utils/Icon';
import {isSpecialSectionType} from 'utils/section';
import classNames from 'classnames';

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
    const {section} = this.props;
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
    if (section.type === "introduction") { // Intros never render this
      return null;
    }
    if (section.type === "closure info") {
      return (
        <h3 className="section-title">
          {section.title}
        </h3>
      );
    }
    const iconName = (collapsed ? "chevron-right" : "chevron-down");
    return (
      <h3 className="section-title" onClick={this.toggle.bind(this)}>
        <Icon name={iconName} /> {this.props.section.title}
      </h3>
    );
  }

  render() {
    const {section} = this.props;
    const collapsed = this.state.collapsed && !isSpecialSectionType(section.type);
    const titleDiv = this.getTitleDiv(collapsed);
    let commentList = null;
    if (collapsed) {
      return (<div className="hearing-section">
        {titleDiv}
        <div className="section-abstract" dangerouslySetInnerHTML={{__html: section.abstract}}></div>
        <hr/>
      </div>);
    }

    if (!isSpecialSectionType(section.type) && section.commenting !== "none") {
      commentList = (<CommentList
        comments={this.props.comments.data}
        canComment={this.props.canComment}
        onPostComment={this.onPostComment.bind(this)}
        canVote={this.props.canVote}
        onPostVote={this.onPostVote.bind(this)}
      />);
    }
    const imageList = section.images.map((image) => (<div key={image.url}>
      <img className="img-responsive" alt={image.title} title={image.title} src={image.url}/>
      <div className="image-caption">{image.caption}</div>
    </div>));
    const sectionClass = classNames({
      'hearing-section': true,
      'closure-info': section.type === "closure info"
    });
    return (<div className={sectionClass}>
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
