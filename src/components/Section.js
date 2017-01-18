/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import SortableCommentList from './SortableCommentList';
import {Link} from 'react-router';
import Icon from '../utils/Icon';
import {isSpecialSectionType, userCanComment} from '../utils/section';
import classNames from 'classnames';
import MapdonHKRPlugin from './plugins/legacy/mapdon-hkr';
import MapdonKSVPlugin from './plugins/legacy/mapdon-ksv';
import MapQuestionnaire from './plugins/MapQuestionnaire';
import Alert from 'react-bootstrap/lib/Alert';
import getAttr from '../utils/getAttr';

function getImageList(section, language) {
  if (section.type === "main") { // Main section images aren't rendered here atleast atm.
    return null;
  }
  return section.images.map((image) => (<div key={image.url}>
    <img className="img-responsive" alt={getAttr(image.title, language)} title={getAttr(image.title, language)} src={image.url}/>
    <div className="image-caption">{getAttr(image.caption, language)}</div>
  </div>));
}


export default class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  // componentDidMount() {
  //   // if (!this.isCollapsible()) {  // Trigger immediate comment load for uncollapsible sections
  //   //   this.loadComments();
  //   // }
  // }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.collapsed && !nextState.collapsed) {  // (Re-)load comments when uncollapsing
      // this.loadComments();
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

  loadComments() {
    const {section} = this.props;
    if (this.props.loadSectionComments) {
      this.props.loadSectionComments(section.id);
    }
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

  renderPluginContent(section) {
    if (!this.props.showPlugin) {
      return null;
    }
    const {user} = this.props;
    const comments = this.props.comments ? this.props.comments.data : [];
    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return null;
    }
    switch (section.plugin_identifier) {
      case "mapdon-hkr":
        return (
          <MapdonHKRPlugin
            data={section.plugin_data}
            onPostComment={this.onPostComment.bind(this)}
          />
        );
      case "mapdon-ksv":
        return (
          <MapdonKSVPlugin
            data={section.plugin_data}
            onPostComment={this.onPostComment.bind(this)}
            pluginPurpose="postComments"
            canSetNickname={user === null}
          />
        );
      case "map-questionnaire":
        return (
          <MapQuestionnaire
            data={section.plugin_data}
            onPostComment={this.onPostComment.bind(this)}
            onPostVote={this.onPostVote.bind(this)}
            comments={comments}
            pluginPurpose="postComments"
            canSetNickname={user === null}
            displayCommentBox={false}
            pluginSource={section.plugin_iframe_url}
          />
        );
      default:
        return <Alert>I do not know how to render the plugin {section.plugin_identifier}</Alert>;
    }
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
    const {section, user} = this.props;
    const {language} = this.context;
    const collapsible = this.isCollapsible();
    const collapsed = collapsible && this.state.collapsed;
    const titleDiv = this.getTitleDiv(collapsed, collapsible);
    let commentList = null;
    if (collapsed) {
      return (
        <div className="section-list-item">
          <div className="section-list-item-image" onClick={this.toggle.bind(this)}>
            {section.images.length ? <img role="presentation" src={section.images[0].url} /> : null}
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
        comments={(this.props.comments ? this.props.comments.results : null) || []}
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
    const pluginContent = this.renderPluginContent(section);
    return (<div className={sectionClass}>
      {titleDiv}
      <div className="section-content">
        {imageList}
        {section.type !== "main" ?
          <div className="section-abstract lead" dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}} /> : null}
        <div dangerouslySetInnerHTML={{__html: getAttr(section.content, language)}} />
        {pluginContent}
      </div>
      {commentList}
      <hr/>
    </div>);
  }
}

Section.defaultProps = {
  showPlugin: true,
  isCollapsible: true,
};

Section.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  comments: React.PropTypes.object,
  isCollapsible: React.PropTypes.bool,
  linkTo: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
    React.PropTypes.func
  ]),
  loadSectionComments: React.PropTypes.func,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  section: React.PropTypes.object.isRequired,
  showPlugin: React.PropTypes.bool,
  user: React.PropTypes.object,
  canSetNickname: React.PropTypes.bool,
  handleDeleteClick: React.PropTypes.func,
  onEditComment: React.PropTypes.func
};

Section.contextTypes = {
  language: React.PropTypes.string.isRequired
};
