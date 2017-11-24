import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Row, Col} from 'react-bootstrap';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import WrappedCarousel from '../components/Carousel';
import DeleteModal from './DeleteModal';
import {
  followHearing,
  postSectionComment,
  postVote,
  editSectionComment,
  deleteSectionComment,
  fetchSectionComments,
  fetchAllSectionComments,
  fetchMoreSectionComments,
} from '../actions';
// import HearingImageList from './HearingImageList';
import WrappedSection from './Section';
// import SectionList from './SectionList';
import Header from '../views/Hearing/Header';
import Sidebar from '../views/Hearing/Sidebar';
import Icon from '../utils/Icon';
import {getClosureSection, getHearingURL, getMainSection} from '../utils/hearing';
import {
  getSectionURL,
  groupSections,
  isSpecialSectionType,
  isSectionCommentable,
  isSectionVotable,
} from '../utils/section';
import getAttr from '../utils/getAttr';
import { parseQuery } from '../utils/urlQuery';

export class SectionContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {showDeleteModal: false};
  }

  onPostSectionComment(sectionId, sectionCommentData) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = parseQuery(this.props.location.search);
    const commentData = Object.assign({authCode}, sectionCommentData);
    dispatch(postSectionComment(hearingSlug, sectionId, commentData));
  }

  onVoteComment(commentId, sectionId) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(postVote(commentId, hearingSlug, sectionId));
  }

  onFollowHearing() {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(followHearing(hearingSlug));
  }

  getFollowButton() {
    if (this.props.user === null) {
      return null;
    }
    return (
      <span className="pull-right">
        <Button bsStyle="primary" onClick={this.onFollowHearing.bind(this)}>
          <Icon name="bell-o" /> <FormattedMessage id="follow" />
        </Button>
      </span>
    );
  }

  getClosureInfo(hearing) {
    const {formatMessage} = this.props.intl;
    const closureInfo = getClosureSection(hearing);
    if (closureInfo) {
      return closureInfo;
    }
    // Render default closure info if no custom section is specified
    return {
      type: 'closure-info',
      title: '',
      abstract: '',
      images: [],
      content: formatMessage({id: 'defaultClosureInfo'}),
    };
  }

  onEditSectionComment(sectionId, commentId, commentData) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = parseQuery(this.props.location.search);
    Object.assign({authCode}, commentData);
    dispatch(editSectionComment(hearingSlug, sectionId, commentId, commentData));
  }

  onDeleteComment() {
    const {dispatch} = this.props;
    const {sectionId, commentId} = this.state.commentToDelete;
    const hearingSlug = this.props.hearingSlug;
    dispatch(deleteSectionComment(hearingSlug, sectionId, commentId));
    this.forceUpdate();
  }

  handleDeleteClick(sectionId, commentId) {
    this.setState({commentToDelete: {sectionId, commentId}});
    this.openDeleteModal();
  }

  openDeleteModal() {
    this.setState({showDeleteModal: true});
  }

  closeDeleteModal() {
    this.setState({showDeleteModal: false, commentToDelete: {}});
  }

  getQuestionLinksAndStuff(sectionGroups) {
    const {hearing: {slug: hearingSlug}, section: {id: sectionId}} = this.props;
    const questions = sectionGroups.reduce(
      (questionsArray, currentSection) => [...questionsArray, ...currentSection.sections],
      [],
    );
    const currentIndex = questions.findIndex(question => question.id === sectionId);
    const prevPath = currentIndex !== 0 ? getSectionURL(hearingSlug, questions[currentIndex - 1]) : undefined;
    const nextPath =
      currentIndex !== questions.length - 1 ? getSectionURL(hearingSlug, questions[currentIndex + 1]) : undefined;
    const prevType = currentIndex !== 0 ? questions[currentIndex - 1].type_name_singular : undefined;
    const nextType = currentIndex !== questions.length - 1 ? questions[currentIndex + 1].type_name_singular : undefined;

    return {
      currentNum: currentIndex + 1,
      totalNum: questions.length,
      prevPath,
      nextPath,
      prevType,
      nextType,
    };
  }

  render() {
    const {hearing, hearingSlug, section, user, sectionComments, language, dispatch} = this.props;
    // const hearingAllowsComments = acceptsComments(hearing);
    const closureInfoSection = this.getClosureInfo(hearing);
    // const regularSections = hearing.sections.filter((section) => !isSpecialSectionType(section.type));
    const mainSection = getMainSection(hearing);
    const regularSections = hearing.sections.filter(sect => !isSpecialSectionType(sect.type));
    const sectionGroups = groupSections(regularSections);
    const sectionNav = this.getQuestionLinksAndStuff(sectionGroups);
    const isQuestionView = true;
    const showPluginInline = Boolean(!section.plugin_fullscreen && section.plugin_identifier);
    // const fullscreenMapPlugin = hasFullscreenMapPlugin(hearing);
    return (
      <div className="hearing-wrapper section-container">
        <div className="text-right">{this.getFollowButton()}</div>
        <Header hearing={hearing} activeLanguage={language} />
        <WrappedCarousel language={language} hearing={hearing} />
        <Row>
          <Col md={12} lg={12}>
            {hearing.closed ? <WrappedSection section={closureInfoSection} canComment={false} /> : null}
            <WrappedSection
              isQuestionView
              section={section}
              hearingSlug={hearingSlug}
              canComment={isSectionCommentable(hearing, section, user)}
              onPostComment={this.onPostSectionComment.bind(this)} // this.props.onPostComment}
              canVote={isSectionVotable(hearing, section, user)} // this.props.canVote && userCanVote(user, section)}
              onPostVote={this.onVoteComment.bind(this)} // this.props.onPostVote}
              comments={sectionComments} // this.props.loadSectionComments}
              handleDeleteClick={this.handleDeleteClick.bind(this)}
              onEditComment={this.onEditSectionComment.bind(this)}
              user={user}
              isCollapsible={false}
              showPlugin={showPluginInline}
              fetchAllComments={this.props.fetchAllComments}
              fetchCommentsForSortableList={this.props.fetchCommentsForSortableList}
              fetchMoreComments={this.props.fetchMoreComments}
              sectionNav={sectionNav}
              hearingUrl={getHearingURL(hearing)}
            />
          </Col>
        </Row>
        <DeleteModal
          isOpen={this.state.showDeleteModal}
          close={this.closeDeleteModal.bind(this)}
          onDeleteComment={this.onDeleteComment.bind(this)}
        />
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
SectionContainer.propTypes = {
  intl: intlShape.isRequired,
  dispatch: PropTypes.func,
  hearing: PropTypes.object,
  hearingSlug: PropTypes.string,
  location: PropTypes.object,
  user: PropTypes.object,
  section: PropTypes.object,
  sectionComments: PropTypes.object,
  language: PropTypes.string,
  fetchAllComments: PropTypes.func,
  fetchCommentsForSortableList: PropTypes.func,
  fetchMoreComments: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  fetchAllComments: (hearingSlug, sectionId, ordering) =>
    dispatch(fetchAllSectionComments(hearingSlug, sectionId, ordering)),
  fetchCommentsForSortableList: (sectionId, ordering) => dispatch(fetchSectionComments(sectionId, ordering)),
  fetchMoreComments: (sectionId, ordering, nextUrl) => dispatch(fetchMoreSectionComments(sectionId, ordering, nextUrl)),
  dispatch,
});

export function wrapSectionContainer(component, pure = true) {
  const wrappedComponent = connect(null, mapDispatchToProps, null, {pure})(injectIntl(component));
  // We need to re-hoist the data statics to the wrapped component due to react-intl:
  wrappedComponent.canRenderFully = component.canRenderFully;
  wrappedComponent.fetchData = component.fetchData;
  return wrappedComponent;
}

export default wrapSectionContainer(SectionContainer);
