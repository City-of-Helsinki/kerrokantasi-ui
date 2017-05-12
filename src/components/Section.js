/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import {connect} from 'react-redux';
import SortableCommentList from './SortableCommentList';
import {Link} from 'react-router';
import Icon from '../utils/Icon';
import {isSpecialSectionType, userCanComment} from '../utils/section';
import classNames from 'classnames';
import PluginContent from './PluginContent';
import getAttr from '../utils/getAttr';
import {fetchAllSectionComments} from "../actions/index";

function getImageList(section, language) {
  if (section.type === "main") { // Main section images aren't rendered here atleast atm.
    return null;
  }
  return section.images.map((image) => (<div key={image.url}>
    <img
      className="img-responsive"
      alt={getAttr(image.title, language)}
      title={getAttr(image.title, language)}
      src={image.url}
    />
    <div className="image-caption">{getAttr(image.caption, language)}</div>
  </div>));
}


export class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  componentDidMount() {
    const {showPlugin, hearingSlug, section} = this.props;
    if (showPlugin) { // Plugins need all the comment data
      this.props.fetchAllComments(hearingSlug, section.id);
    }
  }

  onPostComment(text, authorName, pluginData, geojson, label, images) {
    const {section} = this.props;
    const commentData = {text, authorName, pluginData, geojson, label, images};
    if (this.props.onPostComment) {
      this.props.onPostComment(section.id, commentData);
    }
  }

  onPostVote(commentId) {
    const {section} = this.props;
    this.props.onPostVote(commentId, section.id);
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  getTitleDiv(collapsed, collapsible) {
    const {section, linkTo} = this.props;
    const {language} = this.context;
    if (section.type === "main") {
      return null;
    }
    if (section.type === "closure-info") {
      return (
        <h3 className="section-title">
          {getAttr(section.title, language)}
        </h3>
      );
    }
    const iconName = (collapsed ? "chevron-right" : "chevron-down");

    if (linkTo) {
      return (
        <h2 className="section-title" onClick={this.toggle.bind(this)}>
          <Link to={linkTo}>
            {collapsible ? (<span><Icon name={iconName}/>&nbsp;</span>) : null}
            {getAttr(this.props.section.title, language)}
          </Link>
          {collapsed ? (
            <div className="section-title-comments">
              <Icon name="comment-o"/>&nbsp;{section.n_comments}
            </div>
          ) : null}
        </h2>
      );
    }

    return (
      <h2 className="section-title" onClick={this.toggle.bind(this)}>
        {collapsible ? (<span><Icon name={iconName}/>&nbsp;</span>) : null}
        {getAttr(this.props.section.title, language)}
        {collapsed ? (
          <div className="section-title-comments">
            <Icon name="comment-o"/>&nbsp;{section.n_comments}
          </div>
        ) : null}
      </h2>
    );
  }

  isCollapsible() {
    const {section, isCollapsible} = this.props;
    const hasPlugin = !!section.plugin_identifier;
    return isCollapsible && !isSpecialSectionType(section.type) && !hasPlugin;
  }

  isCommentable() {
    const {section} = this.props;
    const hasPlugin = !!section.plugin_identifier;
    return (this.props.canComment && !hasPlugin);
  }

  render() {
    const {section, user, comments} = this.props;
    const {language} = this.context;
    const collapsible = this.isCollapsible();
    const collapsed = collapsible && this.state.collapsed;
    const titleDiv = this.getTitleDiv(collapsed, collapsible);
    let commentList = null;
    if (collapsed) {
      return (
        <div className="section-list-item">
          <div className="section-list-item-image" onClick={this.toggle.bind(this)}>
            {section.images.length ? <img alt="" src={section.images[0].url} /> : null}
          </div>
          <div className="section-list-item-content">
            {titleDiv}
            <div className="section-abstract" dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}} />
          </div>
          <hr/>
        </div>
      );
    }
    if (!isSpecialSectionType(section.type)) {
      commentList = (<SortableCommentList
        section={section}
        canComment={this.isCommentable() && userCanComment(this.props.user, section)}
        onPostComment={this.onPostComment.bind(this)}
        canVote={this.props.canVote}
        onPostVote={this.onPostVote.bind(this)}
        canSetNickname={!user}
        isSectionComments={section}
        onDeleteComment={this.props.handleDeleteClick}
        onEditComment={this.props.onEditComment}
      />);
    }
    const imageList = getImageList(section, language);
    const sectionClass = classNames({
      'hearing-section': true,
      'closure-info': section.type === "closure-info"
    });
    const pluginContent = (this.props.showPlugin ?
      (<PluginContent
        section={section}
        comments={comments}
        onPostComment={this.onPostComment.bind(this)}
        onPostVote={this.onPostVote.bind(this)}
        user={user}
      />)
      : null);
    return (<div className={sectionClass}>
      {titleDiv}
      <div className="section-content">
        {imageList}
        {section.type !== "main" ?
          <div
            className="section-abstract lead"
            dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}}
          /> :
          null}
        <div dangerouslySetInnerHTML={{__html: getAttr(section.content, language)}} />
        {pluginContent}
      </div>
      {commentList}
      <hr/>
    </div>);
  }
}

Section.defaultProps = {
  showPlugin: false,
  isCollapsible: true,
};

Section.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  comments: React.PropTypes.object,
  fetchAllComments: React.PropTypes.func,
  hearingSlug: React.PropTypes.string,
  isCollapsible: React.PropTypes.bool,
  linkTo: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
    React.PropTypes.func
  ]),
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  section: React.PropTypes.object.isRequired,
  showPlugin: React.PropTypes.bool,
  user: React.PropTypes.object,
  handleDeleteClick: React.PropTypes.func,
  onEditComment: React.PropTypes.func,
};

Section.contextTypes = {
  language: React.PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  fetchAllComments: (hearingSlug, sectionId) => dispatch(
    fetchAllSectionComments(hearingSlug, sectionId)
  )
});

export default connect(null, mapDispatchToProps)(Section);
