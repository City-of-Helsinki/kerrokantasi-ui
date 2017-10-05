/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SortableCommentList from './SortableCommentList';
import {Link} from 'react-router-dom';
import Icon from '../utils/Icon';
import {isSpecialSectionType, userCanComment} from '../utils/section';
import classNames from 'classnames';
import PluginContent from './PluginContent';
import getAttr from '../utils/getAttr';
import {fetchAllSectionComments} from '../actions/index';
import {isEmpty} from 'lodash';

function getImageList(section, language) {
  if (section.type === 'main') {
    // Main section images aren't rendered here atleast atm.
    return null;
  }
  return section.images.map(image => (
    <div key={image.url}>
      <img
        className="img-responsive"
        alt={getAttr(image.title, language)}
        title={getAttr(image.title, language)}
        src={image.url}
      />
      <div className="image-caption">{getAttr(image.caption, language)}</div>
    </div>
  ));
}

export class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
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
    if (section.type === 'main') {
      return null;
    }
    if (section.type === 'closure-info') {
      if (!isEmpty(section.title)) {
        return <h3 className="section-title">{getAttr(section.title, language)}</h3>;
      }
      return null;
    }
    const iconName = collapsed ? 'chevron-right' : 'chevron-down';

    if (linkTo) {
      return (
        <div className="section-title">
          <h3 onClick={this.toggle.bind(this)}>
            <Link to={linkTo}>
              {collapsible ? (
                <span>
                  <Icon name={iconName} />&nbsp;
                </span>
              ) : null}
              {getAttr(this.props.section.title, language)}
            </Link>
          </h3>
          {collapsed ? (
            <div className="section-comments">
              <Icon name="comment-o" />&nbsp;{section.n_comments}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="section-title">
        <h3 className="section-title" onClick={this.toggle.bind(this)}>
          {collapsible ? (
            <span>
              <Icon name={iconName} />&nbsp;
            </span>
          ) : null}
          {getAttr(this.props.section.title, language)}
        </h3>
        {collapsed ? (
          <div className="section-comments">
            <Icon name="comment-o" />&nbsp;{section.n_comments}
          </div>
        ) : null}
      </div>
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
    return this.props.canComment && !hasPlugin;
  }

  render() {
    const {section, user, comments, hearingSlug} = this.props;
    const {language} = this.context;
    const collapsible = this.isCollapsible();
    const collapsed = collapsible && this.state.collapsed;
    const titleDiv = this.getTitleDiv(collapsed, collapsible);
    let sectionImageStyle = {
      backgroundImage: 'url(/assets/images/default-image.svg)',
    };
    if (section.images.length) {
      sectionImageStyle = {
        backgroundImage: 'url("' + section.images[0].url + '")',
      };
    }
    let commentList = null;
    if (collapsed) {
      return (
        <div className="section-list-item">
          <div className="section-list-item-image" style={sectionImageStyle} onClick={this.toggle.bind(this)} />
          <div className="section-list-item-content">
            {titleDiv}
            <div className="section-abstract" dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}} />
          </div>
        </div>
      );
    }
    if (!isSpecialSectionType(section.type)) {
      commentList = (
        <SortableCommentList
          section={section}
          canComment={this.isCommentable() && userCanComment(this.props.user, section)}
          onPostComment={this.onPostComment.bind(this)}
          canVote={this.props.canVote}
          onPostVote={this.onPostVote.bind(this)}
          canSetNickname={!user}
          isSectionComments={section}
          onDeleteComment={this.props.handleDeleteClick}
          onEditComment={this.props.onEditComment}
        />
      );
    }
    const imageList = getImageList(section, language);
    const sectionClass = classNames({
      'hearing-section': true,
      'closure-info': section.type === 'closure-info',
    });
    const pluginContent = this.props.showPlugin ? (
      <PluginContent
        hearingSlug={hearingSlug}
        section={section}
        comments={comments}
        fetchAllComments={this.props.fetchAllComments}
        onPostComment={this.onPostComment.bind(this)}
        onPostVote={this.onPostVote.bind(this)}
        user={user}
      />
    ) : null;
    return (
      <div className={sectionClass}>
        {titleDiv}
        <div className="section-content">
          {imageList}
          {section.type !== 'main' && !isEmpty(section.abstract) ? (
            <div
              className="section-abstract lead"
              dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}}
            />
          ) : null}
          <div dangerouslySetInnerHTML={{__html: getAttr(section.content, language)}} />
          {pluginContent}
        </div>
        {commentList}
      </div>
    );
  }
}

Section.defaultProps = {
  showPlugin: false,
  isCollapsible: true,
};

Section.propTypes = {
  canComment: PropTypes.bool,
  canVote: PropTypes.bool,
  comments: PropTypes.object,
  fetchAllComments: PropTypes.func,
  hearingSlug: PropTypes.string,
  isCollapsible: PropTypes.bool,
  linkTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  section: PropTypes.object.isRequired,
  showPlugin: PropTypes.bool,
  user: PropTypes.object,
  handleDeleteClick: PropTypes.func,
  onEditComment: PropTypes.func,
};

Section.contextTypes = {
  language: PropTypes.string.isRequired,
};

export default Section;
