import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {
  getSections,
  getIsHearingPublished,
  getIsHearingClosed,
  getHearingContacts,
  getHearingWithSlug,
  getMainSectionComments
} from '../../../selectors/hearing';
import isEmpty from 'lodash/isEmpty';
import SectionImage from './SectionImage';
import SectionAttachment from './SectionAttachment';
import SectionClosureInfo from './SectionClosureInfo';
import PluginContent from '../../PluginContent';
import SectionBrowser from '../../SectionBrowser';
import ContactList from './ContactList';
import SortableCommentList from '../../SortableCommentList';
import DeleteModal from '../../DeleteModal';
import getAttr from '../../../utils/getAttr';
import {
  SectionTypes,
  userCanComment,
  isSectionVotable,
  isSectionCommentable,
  isMainSection
} from '../../../utils/section';
import {hasFullscreenMapPlugin, canEdit} from '../../../utils/hearing';
import Icon from '../../../utils/Icon';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withRouter} from 'react-router-dom';
import {parseQuery} from '../../../utils/urlQuery';
import {
  postSectionComment,
  postVote,
  editSectionComment,
  deleteSectionComment,
  fetchAllSectionComments,
  fetchSectionComments,
  fetchMoreSectionComments,
} from '../../../actions';
import Link from '../../LinkWithLang';

export class SectionContainerComponent extends React.Component {
  state = {
    showDeleteModal: false,
    commentToDelete: {},
    showLightbox: false
  };

  getSectionNav = () => {
    const {sections, match} = this.props;
    const filteredSections = sections.filter(section => section.type !== SectionTypes.CLOSURE);
    const currentSectionIndex = match.params.sectionId ? filteredSections.findIndex(section => section.id === match.params.sectionId) : 0;
    let prevPath;
    if (filteredSections[currentSectionIndex - 1] && isMainSection(filteredSections[currentSectionIndex - 1])) {
      prevPath = `/${match.params.hearingSlug}/`;
    } else {
      prevPath = currentSectionIndex - 1 >= 0 ? `/${match.params.hearingSlug}/` + filteredSections[currentSectionIndex - 1].id : undefined;
    }
    const nextPath = currentSectionIndex + 1 < filteredSections.length ? `/${match.params.hearingSlug}/` + filteredSections[currentSectionIndex + 1].id : undefined;

    return {
      prevPath,
      nextPath,
      currentNum: currentSectionIndex + 1,
      totalNum: filteredSections.length
    };
  }

  onPostComment = (sectionId, sectionCommentData) => { // Done
    const {match, location} = this.props;
    const hearingSlug = match.params.hearingSlug;
    const {authCode} = parseQuery(location.search);
    const commentData = Object.assign({authCode}, sectionCommentData);
    this.props.postSectionComment(hearingSlug, sectionId, commentData);
  }

  onVoteComment = (commentId, sectionId) => {
    const {match} = this.props;
    const hearingSlug = match.params.hearingSlug;
    this.props.postVote(commentId, hearingSlug, sectionId);
  }

  onEditComment = (sectionId, commentId, commentData) => {
    const {match, location} = this.props;
    const hearingSlug = match.params.hearingSlug;
    const {authCode} = parseQuery(location.search);
    Object.assign({authCode}, commentData);
    this.props.editComment(hearingSlug, sectionId, commentId, commentData);
  }

  onDeleteComment = () => {
    const {match} = this.props;
    const {sectionId, commentId} = this.state.commentToDelete;
    const hearingSlug = match.params.hearingSlug;
    this.props.deleteSectionComment(hearingSlug, sectionId, commentId);
    this.forceUpdate();
  }

  onPostPluginComment = (text, authorName, pluginData, geojson, label, images) => { // Done
    const sectionCommentData = {text, authorName, pluginData, geojson, label, images};
    const {match, location, sections} = this.props;
    const mainSection = sections.find(sec => sec.type === SectionTypes.MAIN);
    const hearingSlug = match.params.hearingSlug;
    const {authCode} = parseQuery(location.search);
    const commentData = Object.assign({authCode}, sectionCommentData);
    this.props.postSectionComment(hearingSlug, mainSection.id, commentData);
  }

  onVotePluginComment = (commentId) => {
    const {match, sections} = this.props;
    const hearingSlug = match.params.hearingSlug;
    const mainSection = sections.find(sec => sec.type === SectionTypes.MAIN);
    const sectionId = mainSection.id;
    this.props.postVote(commentId, hearingSlug, sectionId);
  }

  handleDeleteClick = (sectionId, commentId) => {
    this.setState({commentToDelete: {sectionId, commentId}});
    this.openDeleteModal();
  }

  openDeleteModal = () => {
    this.setState({showDeleteModal: true});
  }

  closeDeleteModal = () => {
    this.setState({showDeleteModal: false, commentToDelete: {}});
  }

  isCommentable = (section) => {
    const {hearing, user} = this.props;
    const hasPlugin = !!section.plugin_identifier;
    return isSectionCommentable(hearing, section, user) && !hasPlugin;
  }

  openLightbox = () => {
    document.body.classList.remove('nav-fixed');
    this.setState({showLightbox: true});
  }

  closeLightbox = () => {
    document.body.classList.add('nav-fixed');
    this.setState({showLightbox: false});
  }

  /**
   * If files are attached to the section, render the files section
   * @returns {JSX<Component>} component if files exist.
   */
  renderFileSection = (section) => {
    const {files} = section;
    const {language} = this.props;
    if (files && files.length > 0) {
      // Construct the UI specification for displaying files.
      return (
        <div className="hearing-attachments">
          <h4><FormattedMessage id="attachments" /></h4>
          {
            files.map((file) => (
              <SectionAttachment file={file} key={`file-${file.url}`} language={language} />
            ))
          }
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      hearing,
      showClosureInfo,
      sections,
      match,
      language,
      contacts,
      intl,
      user,
      fetchAllComments,
      mainSectionComments
    } = this.props;
    const {showLightbox} = this.state;
    const mainSection = sections.find(sec => sec.type === SectionTypes.MAIN);
    const section = sections.find(sec => sec.id === match.params.sectionId) || mainSection;
    const sectionImage = section.images[0];
    const closureInfoContent = sections.find(sec => sec.type === SectionTypes.CLOSURE) ? getAttr(sections.find(sec => sec.type === SectionTypes.CLOSURE).content, language) : intl.formatMessage({id: 'defaultClosureInfo'});
    const showSectionBrowser = sections.filter(sec => sec.type !== SectionTypes.CLOSURE).length > 1;
    const userIsAdmin = !isEmpty(user) && canEdit(user, hearing);

    return (
      <div>
        {isEmpty(section) ?
          <div>Loading</div>
        :
          <div className="container">
            <div className="hearing-content-section">
              <Grid>
                <Row>
                  <Col md={8} mdOffset={2}>
                    {sectionImage &&
                      <SectionImage
                        image={sectionImage}
                        caption={getAttr(sectionImage.caption, language)}
                        title={getAttr(sectionImage.title, language)}
                        showLightbox={showLightbox}
                        openLightbox={this.openLightbox}
                        closeLightbox={this.closeLightbox}
                      />
                    }
                    {!isEmpty(section.abstract) &&
                      <div
                        className="section-abstract lead"
                        dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}}
                      />
                    }
                    {showClosureInfo
                      ? <SectionClosureInfo content={closureInfoContent} />
                      : null
                    }
                    {!isEmpty(section.content) &&
                      <div dangerouslySetInnerHTML={{__html: getAttr(section.content, language)}} />
                    }
                    {
                      this.renderFileSection(section)
                    }
                    {mainSection.plugin_identifier &&
                    <div className="plugin-content">
                      <PluginContent
                        hearingSlug={match.params.hearingSlug}
                        fetchAllComments={fetchAllComments}
                        section={mainSection}
                        comments={mainSectionComments}
                        onPostComment={this.onPostPluginComment}
                        onPostVote={this.onVotePluginComment}
                        user={user}
                      />
                    </div>
                    }
                    {showSectionBrowser && <SectionBrowser sectionNav={this.getSectionNav()} />}
                    {section.id === mainSection.id && <ContactList contacts={contacts} />}
                    {hasFullscreenMapPlugin(hearing) &&
                      <Link to={{path: `/${match.params.hearingSlug}/fullscreen`}}>
                        <Button style={{marginBottom: '48px'}} bsStyle="primary" bsSize="large" block>
                          <Icon name="arrows-alt" fixedWidth />
                          <h4><FormattedMessage id="openFullscreenMap" /></h4>
                        </Button>
                      </Link>
                    }
                    <SortableCommentList
                      section={section}
                      canComment={this.isCommentable(section) && userCanComment(this.props.user, section)}
                      onPostComment={this.onPostComment}
                      canVote={isSectionVotable(hearing, section, user)}
                      onPostVote={this.onVoteComment}
                      defaultNickname={user && user.displayName}
                      isSectionComments={section}
                      onDeleteComment={this.handleDeleteClick}
                      onEditComment={this.onEditComment}
                      fetchAllComments={fetchAllComments}
                      fetchComments={this.props.fetchCommentsForSortableList}
                      fetchMoreComments={this.props.fetchMoreComments}
                      displayVisualization={userIsAdmin || hearing.closed}
                      published={hearing.published} // Needed so comments are not diplayed in hearing drafts
                      closed={hearing.closed}
                    />
                  </Col>
                </Row>
              </Grid>
            </div>
            <DeleteModal
              isOpen={this.state.showDeleteModal}
              close={this.closeDeleteModal}
              onDeleteComment={this.onDeleteComment}
            />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  showClosureInfo: getIsHearingClosed(state, ownProps.match.params.hearingSlug) && getIsHearingPublished(state, ownProps.match.params.hearingSlug),
  sections: getSections(state, ownProps.match.params.hearingSlug),
  sectionComments: state.sectionComments,
  mainSectionComments: getMainSectionComments(state, ownProps.match.params.hearingSlug),
  language: state.language,
  contacts: getHearingContacts(state, ownProps.match.params.hearingSlug),
  user: state.user.data
});

const mapDispatchToProps = (dispatch) => ({
  postSectionComment: (hearingSlug, sectionId, commentData) => dispatch(postSectionComment(hearingSlug, sectionId, commentData)),
  postVote: (commentId, hearingSlug, sectionId) => dispatch(postVote(commentId, hearingSlug, sectionId)),
  editComment: (hearingSlug, sectionId, commentId, commentData) => dispatch(editSectionComment(hearingSlug, sectionId, commentId, commentData)),
  deleteSectionComment: (hearingSlug, sectionId, commentId) => dispatch(deleteSectionComment(hearingSlug, sectionId, commentId)),
  fetchAllComments: (hearingSlug, sectionId, ordering) =>
    dispatch(fetchAllSectionComments(hearingSlug, sectionId, ordering)),
  fetchCommentsForSortableList: (sectionId, ordering) => dispatch(fetchSectionComments(sectionId, ordering)),
  fetchMoreComments: (sectionId, ordering, nextUrl) => dispatch(fetchMoreSectionComments(sectionId, ordering, nextUrl)),

});

SectionContainerComponent.propTypes = {
  sections: PropTypes.array,
  mainSectionComments: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  language: PropTypes.string,
  showClosureInfo: PropTypes.bool,
  contacts: PropTypes.array,
  postSectionComment: PropTypes.func,
  postVote: PropTypes.func,
  editComment: PropTypes.func,
  deleteSectionComment: PropTypes.func,
  hearing: PropTypes.object,
  user: PropTypes.object,
  intl: intlShape.isRequired,
  fetchAllComments: PropTypes.func,
  fetchCommentsForSortableList: PropTypes.func,
  fetchMoreComments: PropTypes.func,
};

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(SectionContainerComponent)));
