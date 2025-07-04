/* eslint-disable sonarjs/no-inverted-boolean-check */
/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Collapse } from 'react-bootstrap';
import { Button } from 'hds-react';
import { connect, useSelector } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedPlural } from 'react-intl';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import ContactCard from '../../ContactCard';
import DeleteModal from '../../DeleteModal';
import HearingMap from '../HearingMap';
import Icon from '../../../utils/Icon';
import InternalLink from '../../InternalLink';
import Link from '../../LinkWithLang';
import PluginContent from '../../PluginContent';
import SectionAttachment from './SectionAttachment';
import SectionBrowser from '../../SectionBrowser';
import SectionImage from './SectionImage';
import SortableCommentList from '../../SortableCommentList';
import getAttr from '../../../utils/getAttr';
import SubSectionsList from './SubSectionsList';
import { hasFullscreenMapPlugin, canEdit, getHearingURL } from '../../../utils/hearing';
import { parseQuery } from '../../../utils/urlQuery';
import { SectionTypes, isSectionVotable, isSectionCommentable, isMainSection } from '../../../utils/section';
import {
  postSectionComment,
  postVote,
  postFlag,
  editSectionComment,
  deleteSectionComment,
  fetchAllSectionComments,
  fetchSectionComments,
  fetchMoreSectionComments,
  getCommentSubComments,
} from '../../../actions';
import {
  getHearingWithSlug,
  getMainSectionComments,
  getSections,
  getHearingContacts,
} from '../../../selectors/hearing';
import getUser from '../../../selectors/user';
import 'react-image-lightbox/style.css';
import { getApiTokenFromStorage, getApiURL, get as apiGet } from '../../../api';
import LoadSpinner from '../../LoadSpinner';
import { getNickname } from '../../../utils/user';

const SectionContainerComponent = ({
  editCommentFn,
  deleteSectionCommentFn,
  fetchAllCommentsFn,
  fetchMoreCommentsFn,
  fetchCommentsForSortableListFn,
  getCommentSubCommentsFn,
  language,
  onPostReply,
  postSectionCommentFn,
  postFlagFn,
  postVoteFn,
  user,
}) => {
  const [mainHearingDetailsOpen, setMainHearingDetailsOpen] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );
  const [mainHearingProjectOpen, setMainHearingProjectOpen] = useState(false);
  const [mainHearingContactsOpen, setMainHearingContactsOpen] = useState(false);
  const [mainHearingAttachmentsOpen, setMainHearingAttachmentsOpen] = useState(false);

  const { hearingSlug, sectionId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();

  const hearing = useSelector((state) => getHearingWithSlug(state, hearingSlug));
  const sections = useSelector((state) => getSections(state, hearingSlug));
  const mainSectionComments = useSelector((state) => getMainSectionComments(state, hearingSlug));
  const contacts = useSelector((state) => getHearingContacts(state, hearingSlug));
  const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
  const section = sections.find((sec) => sec.id === sectionId) || mainSection;

  const [data, setData] = useState({
    commentToDelete: {},
    showLightbox: false,
    mapContainer: null,
    mapContainerMobile: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    showDeleteModal: false,
    commentSectionId: undefined,
    commentId: undefined,
    refreshUser: false,
  });

  const getSectionNav = () => {
    const filterNotClosedSections = sections.filter((sec) => sec.type !== SectionTypes.CLOSURE);
    const filteredSections = filterNotClosedSections.filter((sec) => sec.type !== SectionTypes.MAIN);
    const currentSectionIndex = sectionId ? filteredSections.findIndex((sec) => sec.id === sectionId) : 0;
    const prevPath =
      currentSectionIndex - 1 >= 0 ? `/${hearingSlug}/${filteredSections[currentSectionIndex - 1].id}` : undefined;
    const nextPath =
      currentSectionIndex + 1 < filteredSections.length
        ? `/${hearingSlug}/${filteredSections[currentSectionIndex + 1].id}`
        : undefined;

    return {
      prev: {
        path: prevPath,
      },
      next: {
        path: nextPath,
      },
      currentNum: currentSectionIndex + 1,
      totalNum: filteredSections.length,
    };
  };

  // downloads report excel with user's credentials
  const handleReportDownload = (reportHearing, reportLanguage) => {
    const accessToken = getApiTokenFromStorage();
    const reportUrl = getApiURL(`/v1/hearing/${reportHearing.slug}/report`);

    apiGet(reportUrl, null, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        // remove filename special characters to avoid potential naming issues
        const filename = reportHearing.title
          ? `${getAttr(reportHearing.title, reportLanguage).replace(/[^a-zA-Z0-9 ]/g, '')}.xlsx`
          : 'kuuluminen.xlsx';

        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  /**
   * When "Show replies" is pressed.
   * Call the redecer to fetch sub comments and populate inside the specific comment
   */
  const handleGetSubComments = (commentId, commentSectionId) => {
    getCommentSubCommentsFn(commentId, commentSectionId);
  };

  const onPostComment = (commentSectionId, sectionCommentData) => {
    // Done
    const { authCode } = parseQuery(search);
    const commentData = { authCode, ...sectionCommentData };

    return postSectionCommentFn(hearingSlug, commentSectionId, commentData);
  };

  const onVoteComment = (commentId, commentSectionId, isReply, parentId) => {
    postVoteFn(commentId, hearingSlug, commentSectionId, isReply, parentId);
  };

  const onFlagComment = (commentId, commentSectionId, isReply, parentId) => {
    postFlagFn(commentId, hearingSlug, commentSectionId, isReply, parentId);
  };

  const onEditComment = (commentSectionId, commentId, commentData) => {
    const { authCode } = parseQuery(search);

    const updatedCommentData = { ...commentData, authCode };

    editCommentFn(hearingSlug, commentSectionId, commentId, updatedCommentData);
  };

  const onPostPluginComment = (comment) => {
    const { authCode } = parseQuery(search);
    const commentData = { authCode, ...comment };
    postSectionCommentFn(hearingSlug, mainSection.id, commentData);
  };

  const onVotePluginComment = (commentId) => {
    const commentSectionId = mainSection.id;
    postVoteFn(commentId, hearingSlug, commentSectionId);
  };

  const onDeleteComment = (commentSectionId, commentId, refreshUser) => {
    deleteSectionCommentFn(hearingSlug, commentSectionId, commentId, refreshUser);
  };

  const openDeleteModal = (commentSectionId, commentId, refreshUser) => {
    setDeleteModal({ showDeleteModal: true, commentSectionId, commentId, refreshUser });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ showDeleteModal: false, commentSectionId: null, commentId: null, refreshUser: false });
  };

  const openLightbox = () => {
    document.body.classList.remove('nav-fixed');
    setData({ ...data, showLightbox: true });
  };

  const closeLightbox = () => {
    document.body.classList.add('nav-fixed');
    setData({ ...data, showLightbox: false });
  };

  const isHearingAdmin = () =>
    user && Array.isArray(user.adminOrganizations) && user.adminOrganizations.includes(hearing.organization);

  /**
   * If files are attached to the section, render the files section
   * @returns {JSX<Component>} component if files exist.
   */
  const renderFileSection = (renderLanguage, published) => {
    const { files } = section;

    if (!(files && files.length > 0)) {
      return null;
    }

    return (
      <section className='hearing-section hearing-attachments'>
        <h2>
          <button
            type='button'
            className='hearing-section-toggle-button'
            onClick={() => setMainHearingAttachmentsOpen(!mainHearingAttachmentsOpen)}
            aria-controls='hearing-section-attachments-accordion'
            id='hearing-section-attachments-accordion-button'
            aria-expanded={mainHearingAttachmentsOpen ? 'true' : 'false'}
            aria-label={<FormattedMessage id='attachments' />}
          >
            <Icon name='angle-right' className={mainHearingAttachmentsOpen ? 'open' : ''} aria-hidden='true' />
            <FormattedMessage id='attachments' />
          </button>
        </h2>
        <Collapse
          in={mainHearingAttachmentsOpen}
          id='hearing-section-attachments-accordion'
          aria-hidden={mainHearingAttachmentsOpen ? 'false' : 'true'}
          role='region'
        >
          <div className='accordion-content'>
            <div className='section-content-spacer'>
              {!published && (
                <p>
                  <FormattedMessage id='unpublishedAttachments' />
                </p>
              )}
              {files.map((file) => (
                <SectionAttachment file={file} key={`file-${file.url}`} language={renderLanguage} />
              ))}
            </div>
          </div>
        </Collapse>
      </section>
    );
  };

  const renderProjectPhaseSection = (renderHearing, renderLanguage) => {
    const project = get(renderHearing, 'project');
    const phases = get(project, 'phases') || [];
    const activePhaseIndex = findIndex(phases, (phase) => phase.is_active);
    const numberOfItems = phases.length;

    if (isEmpty(project)) {
      return null;
    }

    return (
      <section className='hearing-section hearing-project'>
        <h2>
          <button
            type='button'
            className='hearing-section-toggle-button'
            onClick={() => setMainHearingProjectOpen(!mainHearingProjectOpen)}
            aria-controls='hearing-section-project-accordion'
            id='hearing-section-project-accordion-button'
            aria-expanded={mainHearingProjectOpen ? 'true' : 'false'}
          >
            <span>
              <Icon name='angle-right' className={mainHearingProjectOpen ? 'open' : ''} aria-hidden='true' />
              <FormattedMessage id='phase' /> {activePhaseIndex + 1}/{numberOfItems}
            </span>
            <span className='hearing-section-toggle-button-subtitle'>
              <FormattedMessage id='project' /> {getAttr(project.title, renderLanguage)}
            </span>
          </button>
        </h2>
        <Collapse
          in={mainHearingProjectOpen}
          id='hearing-section-project-accordion'
          aria-hidden={mainHearingProjectOpen ? 'false' : 'true'}
          role='region'
        >
          <div className='accordion-content'>
            <div className='project-phases-list section-content-spacer'>
              {phases.map((phase, index) => (
                <div className='phases-list-item' key={phase.id}>
                  <div className={`phase-order ${phase.is_active ? 'active-phase' : ''}`}>
                    <span className='sr-only'>
                      <FormattedMessage id='phase' />
                    </span>
                    {index + 1}
                    {phase.is_active && (
                      <span className='sr-only'>
                        <FormattedMessage id='phaseActive' />
                      </span>
                    )}
                  </div>
                  <div className='phase-texts'>
                    <span className='phase-title'>
                      {!isEmpty(phase.hearings) ? (
                        <Link to={{ path: phase.hearings[0] }}>{getAttr(phase.title, renderLanguage)}</Link>
                      ) : (
                        <span>{getAttr(phase.title, renderLanguage)}</span>
                      )}
                    </span>
                    <span className='phase-description'>{getAttr(phase.description, renderLanguage)}</span>
                    <span className='phase-schedule'>{getAttr(phase.schedule, renderLanguage)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Collapse>
      </section>
    );
  };

  const renderContacts = (renderContactlist, renderLanguage) => {
    if (isEmpty(renderContactlist)) {
      return null;
    }

    return (
      <section className='hearing-section'>
        <h2>
          <button
            type='button'
            className='hearing-section-toggle-button'
            onClick={() => setMainHearingContactsOpen(!mainHearingContactsOpen)}
            aria-controls='hearing-section-contacts-accordion'
            id='hearing-section-contacts-accordion-button'
            aria-expanded={mainHearingContactsOpen ? 'true' : 'false'}
            aria-label={<FormattedMessage id='contactPersons' />}
          >
            <Icon name='angle-right' className={mainHearingContactsOpen ? 'open' : ''} aria-hidden='true' />
            <FormattedMessage id='contactPersons' />
          </button>
        </h2>
        <Collapse
          in={mainHearingContactsOpen}
          id='hearing-section-contacts-accordion'
          aria-hidden={mainHearingContactsOpen ? 'false' : 'true'}
          role='region'
        >
          <div className='accordion-content'>
            <div className='section-content-spacer'>
              <div className='hearing-contacts'>
                {renderContactlist.map((person) => (
                  <div className='hearing-contact' key={person.id}>
                    <ContactCard activeLanguage={renderLanguage} key={person.id} {...person} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Collapse>
      </section>
    );
  };

  const renderReportDownload = (reportUrl, userIsAdmin, renderHearing, renderLanguage) => {
    // render either admin download button or normal download link for others
    if (userIsAdmin) {
      return (
        <Row className='row-no-gutters text-right'>
          <Button
            size='small'
            className='pull-right report-download-button kerrokantasi-btn supplementary'
            onClick={() => handleReportDownload(renderHearing, renderLanguage)}
          >
            <Icon name='download' aria-hidden='true' /> <FormattedMessage id='downloadReport' />
          </Button>
        </Row>
      );
    }

    return (
      <p className='report-download text-right small'>
        <a href={reportUrl} aria-label={<FormattedMessage id='downloadReport' />}>
          <Icon name='download' aria-hidden='true' /> <FormattedMessage id='downloadReport' />
        </a>
      </p>
    );
  };

  const renderCommentsSection = () => {
    const userIsAdmin = !isEmpty(user) && canEdit(user, hearing);
    const reportUrl = getApiURL(`/v1/hearing/${hearing.slug}/report`);
    return (
      <section className='hearing-section comments-section' id='comments-section' tabIndex={-1}>
        {reportUrl && renderReportDownload(reportUrl, userIsAdmin, hearing, language)}
        <SortableCommentList
          section={section}
          canComment={isSectionCommentable(hearing, section, user)}
          onPostComment={onPostComment}
          onPostReply={onPostReply}
          onGetSubComments={handleGetSubComments}
          canVote={isSectionVotable(hearing, section, user)}
          canFlag={isHearingAdmin()}
          onPostVote={onVoteComment}
          onPostFlag={onFlagComment}
          defaultNickname={getNickname(user)}
          isSectionComments={section}
          onDeleteComment={openDeleteModal}
          onEditComment={onEditComment}
          fetchAllComments={fetchAllCommentsFn}
          fetchComments={fetchCommentsForSortableListFn}
          fetchMoreComments={fetchMoreCommentsFn}
          displayVisualization={userIsAdmin || hearing.closed}
          published={hearing.published} // Needed so comments are not diplayed in hearing drafts
          closed={hearing.closed}
          hearingGeojson={hearing.geojson}
        />
      </section>
    );
  };

  const renderSectionImage = (renderLanguage) => {
    const sectionImage = section.images[0];
    const { showLightbox } = data;

    if (!sectionImage) {
      return null;
    }

    return (
      <SectionImage
        image={sectionImage}
        caption={getAttr(sectionImage.caption, renderLanguage)}
        title={getAttr(sectionImage.title, renderLanguage)}
        altText={getAttr(sectionImage.alt_text, renderLanguage)}
        showLightbox={showLightbox}
        openLightbox={openLightbox}
        closeLightbox={closeLightbox}
      />
    );
  };

  const renderSectionContent = (renderLanguage) => {
    if (isEmpty(section.content)) {
      return null;
    }
    return <div dangerouslySetInnerHTML={{ __html: getAttr(section.content, renderLanguage) }} />;
  };

  const renderSectionAbstract = (renderLanguage) => {
    if (isEmpty(section.abstract)) {
      return null;
    }

    return <div className='lead' dangerouslySetInnerHTML={{ __html: getAttr(section.abstract, renderLanguage) }} />;
  };

  const renderMainDetails = (renderHearing, renderSection, renderLanguage) => {
    const sectionImage = renderSection.images[0];

    if (!isEmpty(renderSection.content) || sectionImage) {
      return (
        <section className='hearing-section main-content'>
          <h2>
            <button
              type='button'
              className='hearing-section-toggle-button'
              onClick={() => setMainHearingDetailsOpen(!mainHearingDetailsOpen)}
              aria-controls='hearing-section-details-accordion'
              id='hearing-section-details-accordion-button'
              aria-expanded={mainHearingDetailsOpen ? 'true' : 'false'}
              aria-label={<FormattedMessage id='sectionInformationTitle' />}
            >
              <Icon name='angle-right' className={mainHearingDetailsOpen ? 'open' : ''} aria-hidden='true' />
              <FormattedMessage id='sectionInformationTitle' />
            </button>
          </h2>
          <Collapse
            in={mainHearingDetailsOpen}
            id='hearing-section-details-accordion'
            aria-hidden={mainHearingDetailsOpen ? 'false' : 'true'}
            role='region'
          >
            <div className='accordion-content'>
              <div className='section-content-spacer'>
                {renderSectionImage(renderLanguage)}
                {/* Render main section title if it exists and it's not the same as the hearing title */}
                {!isEmpty(renderSection.title) &&
                  getAttr(renderHearing.title, renderLanguage) !== getAttr(renderSection.title, renderLanguage) && (
                    <h3>{getAttr(renderSection.title, renderLanguage)}</h3>
                  )}
                {renderSectionContent(renderLanguage)}
              </div>
            </div>
          </Collapse>
        </section>
      );
    }
    return null;
  };

  const renderMainHearing = () => {
    const published = 'published' in hearing ? hearing.published : true;

    return (
      <>
        {hearing.geojson && (
          <Col xs={12} className='hidden-md hidden-lg'>
            <div className='hearing-map-container'>
              <HearingMap hearing={hearing} />
            </div>
          </Col>
        )}
        <Col md={8} mdPush={!hearing.geojson ? 2 : 0}>
          {renderMainDetails(hearing, section, language)}

          {renderProjectPhaseSection(hearing, language)}

          {renderContacts(contacts, language)}

          {renderFileSection(language, published)}
          {mainSection.plugin_identifier && (
            <section className='hearing-section plugin-content'>
              <PluginContent
                hearingSlug={hearingSlug}
                fetchAllComments={fetchAllCommentsFn}
                section={mainSection}
                comments={mainSectionComments}
                onPostComment={onPostPluginComment}
                onPostVote={onVotePluginComment}
                user={user}
              />
              {hasFullscreenMapPlugin(hearing) && (
                <Button
                  className='kerrokantasi-btn'
                  onClick={() => navigate({ pathname: getHearingURL(hearing, { fullscreen: true }) })}
                >
                  <Icon name='arrows-alt' fixedWidth aria-hidden='true' />
                  &nbsp;
                  <FormattedMessage id='openFullscreenMap' />
                </Button>
              )}
            </section>
          )}

          <SubSectionsList hearing={hearing} language={language} />

          {renderCommentsSection()}
        </Col>
        {hearing.geojson && (
          <Col md={4} lg={3} lgPush={1} className='hidden-xs visible-sm visible-md visible-lg'>
            <div className='hearing-map-container'>
              <HearingMap hearing={hearing} />
            </div>
          </Col>
        )}
      </>
    );
  };

  const renderSubSectionAttachments = (renderLanguage, published) => {
    const { files } = section;

    if (!(files && files.length > 0)) {
      return null;
    }
    return (
      <div className='hearing-subsection-attachments'>
        <h3>
          <FormattedMessage id='attachments' />
        </h3>
        <div>
          {!published && (
            <p>
              <FormattedMessage id='unpublishedAttachments' />
            </p>
          )}
          {files.map((file) => (
            <SectionAttachment file={file} key={`file-${file.url}`} language={renderLanguage} />
          ))}
        </div>
      </div>
    );
  };

  const renderSubHearing = () => {
    const showSectionBrowser = sections.filter((sec) => sec.type !== SectionTypes.CLOSURE).length > 1;
    const published = 'published' in hearing ? hearing.published : true;

    return (
      <Col md={8} mdPush={2}>
        <h2 className='hearing-subsection-title'>
          <span className='hearing-subsection-title-counter'>
            <FormattedMessage id='subsectionTitle' />
            <span className='aria-hidden'>&nbsp;</span>
            {getSectionNav().currentNum}/{getSectionNav().totalNum}
          </span>
          {getAttr(section.title, language)}
        </h2>

        {!(section.commenting === 'none') && (
          <div className='hearing-subsection-comments-header'>
            <div className='hearing-subsection-comments'>
              <Icon name='comment-o' fixedWidth />
              &nbsp;
              <FormattedPlural
                value={section.n_comments}
                one={<FormattedMessage id='sectionTotalComment' values={{ n: section.n_comments }} />}
                other={<FormattedMessage id='sectionTotalComments' values={{ n: section.n_comments }} />}
              />
            </div>
            {isSectionCommentable(hearing, section, user) && (
              <InternalLink destinationId='comments-section' className='hearing-subsection-write-comment-link'>
                <FormattedMessage id='headerWriteCommentLink' />
              </InternalLink>
            )}
          </div>
        )}

        {renderSectionImage(language)}
        {renderSectionAbstract(language)}
        {renderSectionContent(language)}
        {renderSubSectionAttachments(language, published)}

        {showSectionBrowser && <SectionBrowser sectionNav={getSectionNav()} />}

        {renderCommentsSection()}
      </Col>
    );
  };

  return isEmpty(section) ? (
    <LoadSpinner />
  ) : (
    <Grid>
      <div
        data-testid='hearing-content-section'
        className={`hearing-content-section ${isMainSection(section) ? 'main' : 'subsection'}`}
      >
        <Row>{isMainSection(section) ? renderMainHearing() : renderSubHearing()}</Row>
      </div>
      <DeleteModal
        isOpen={deleteModal.showDeleteModal}
        close={closeDeleteModal}
        onDeleteComment={onDeleteComment}
        commentSectionId={deleteModal.commentSectionId}
        commentId={deleteModal.commentId}
        refreshUser={deleteModal.refreshUser}
      />
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  sectionComments: state.sectionComments,
  language: state.language,
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  postSectionCommentFn: (hearingSlug, sectionId, commentData) =>
    dispatch(postSectionComment(hearingSlug, sectionId, commentData)),
  getCommentSubCommentsFn: (commentId, sectionId) => dispatch(getCommentSubComments(commentId, sectionId)),
  postVoteFn: (commentId, hearingSlug, sectionId, isReply, parentId) =>
    dispatch(postVote(commentId, hearingSlug, sectionId, isReply, parentId)),
  postFlagFn: (commentId, hearingSlug, sectionId, isReply, parentId) =>
    dispatch(postFlag(commentId, hearingSlug, sectionId, isReply, parentId)),
  editCommentFn: (hearingSlug, sectionId, commentId, commentData) =>
    dispatch(editSectionComment(hearingSlug, sectionId, commentId, commentData)),
  deleteSectionCommentFn: (hearingSlug, sectionId, commentId, refreshUser) =>
    dispatch(deleteSectionComment(hearingSlug, sectionId, commentId, refreshUser)),
  fetchAllCommentsFn: (hearingSlug, sectionId, ordering) =>
    dispatch(fetchAllSectionComments(hearingSlug, sectionId, ordering)),
  fetchCommentsForSortableListFn: (sectionId, ordering) => dispatch(fetchSectionComments(sectionId, ordering)),
  fetchMoreCommentsFn: (sectionId, ordering, nextUrl) =>
    dispatch(fetchMoreSectionComments(sectionId, nextUrl, ordering)),
});

SectionContainerComponent.propTypes = {
  contacts: PropTypes.array,
  deleteSectionCommentFn: PropTypes.func,
  editCommentFn: PropTypes.func,
  fetchAllCommentsFn: PropTypes.func,
  fetchCommentsForSortableListFn: PropTypes.func,
  fetchMoreCommentsFn: PropTypes.func,
  getCommentSubCommentsFn: PropTypes.func,
  hearing: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  mainSectionComments: PropTypes.object,
  match: PropTypes.object,
  postSectionCommentFn: PropTypes.func,
  postVoteFn: PropTypes.func,
  postFlagFn: PropTypes.func,
  sections: PropTypes.array,
  user: PropTypes.object,
  onPostReply: PropTypes.func,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SectionContainerComponent));
