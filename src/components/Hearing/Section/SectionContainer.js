import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import {
  getSections,
  getIsHearingPublished,
  getIsHearingClosed,
  getHearingContacts,
  getHearingWithSlug,
} from '../../../selectors/hearing';
import isEmpty from 'lodash/isEmpty';
import SectionImage from './SectionImage';
import SectionClosureInfo from './SectionClosureInfo';
import SectionBrowser from '../../SectionBrowser';
import ContactList from './ContactList';
import SortableCommentList from '../../SortableCommentList';
import DeleteModal from '../../DeleteModal';
import getAttr from '../../../utils/getAttr';
import {
  SectionTypes,
  userCanComment,
  isSectionVotable,
  isSectionCommentable
} from '../../../utils/section';
import {injectIntl, intlShape} from 'react-intl';
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

export class SectionContainerComponent extends React.Component {
  state = {
    showDeleteModal: false,
    commentToDelete: {}
  };

  componentWillReceiveProps(nextProps) {
    const {sections, match: {params}, history} = nextProps;
    if (isEmpty(sections.find(section => section.id === params.sectionId))) {
      history.push(`/${params.hearingSlug}/` + sections.find(sec => sec.type === SectionTypes.MAIN).id);
    }
  }

  getSectionNav = () => {
    const {sections, match} = this.props;
    const filteredSections = sections.filter(section => section.type !== SectionTypes.CLOSURE);
    const currentSectionIndex = match.params.sectionId ? filteredSections.findIndex(section => section.id === match.params.sectionId) : 0;
    const prevPath = currentSectionIndex - 1 >= 0 ? `/${match.params.hearingSlug}/` + filteredSections[currentSectionIndex - 1].id : undefined;
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
    } = this.props;
    const mainSection = sections.find(sec => sec.type === SectionTypes.MAIN);
    const section = sections.find(sec => sec.id === match.params.sectionId) || mainSection;
    const sectionImage = section.images[0];
    const closureInfoContent = sections.find(sec => sec.type === SectionTypes.CLOSURE) ? getAttr(sections.find(sec => sec.type === SectionTypes.CLOSURE).content, language) : intl.formatMessage({id: 'defaultClosureInfo'});
    const showSectionBrowser = sections.filter(sec => sec.type !== SectionTypes.CLOSURE).length > 1;

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
                    {showSectionBrowser && <SectionBrowser sectionNav={this.getSectionNav()} />}
                    <ContactList contacts={contacts} />
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
  language: state.language,
  contacts: getHearingContacts(state, ownProps.match.params.hearingSlug),
  user: state.user
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
