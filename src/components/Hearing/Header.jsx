/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-danger */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Col, Grid, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Button } from 'hds-react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FormattedPlural, FormattedMessage, useIntl } from 'react-intl';
import { stringify } from 'qs';
import { useParams, useLocation } from 'react-router-dom';

import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import FormatRelativeTime from '../../utils/FormatRelativeTime';
import Icon from '../../utils/Icon';
import LabelList from '../LabelList';
import SectionClosureInfo from './Section/SectionClosureInfo';
import SocialBar from '../SocialBar';
import getAttr from '../../utils/getAttr';
import Link from '../LinkWithLang';
import config from '../../config';
import { isPublic, getHearingURL, hasCommentableSections } from '../../utils/hearing';
import { SectionTypes, isMainSection, isSectionCommentable } from '../../utils/section';
import { stringifyQuery } from '../../utils/urlQuery';
import { getSections, getIsHearingPublished, getIsHearingClosed } from '../../selectors/hearing';
import getUser from '../../selectors/user';
import { addHearingToFavorites, removeHearingFromFavorites } from '../../actions';
import InternalLink from '../InternalLink';
import { addToast } from '../../actions/toast';

function HeaderComponent(props) {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { language, hearing } = props;
  const { user, addToFavorites, removeFromFavorites } = props;

  const { hearingSlug } = useParams();
  const intl = useIntl();

  const sections = useSelector((state) => getSections(state, hearingSlug));

  const isHearingClosed = useSelector((state) => getIsHearingClosed(state, hearingSlug));
  const isHearingPublished = useSelector((state) => getIsHearingPublished(state, hearingSlug));
  const showClosureInfo = isHearingClosed && isHearingPublished;

  const getTimetableText = (hearingItem) => {
    const openMessage = (
      <FormatRelativeTime
        timeVal={hearingItem.open_at}
        messagePrefix='timeOpen'
        formatTime={intl.formatTime}
        formatDate={intl.formatDate}
      />
    );
    const closeMessage = (
      <FormatRelativeTime
        timeVal={hearingItem.close_at}
        messagePrefix='timeClose'
        formatTime={intl.formatTime}
        formatDate={intl.formatDate}
      />
    );

    return (
      <div className='hearing-meta__element timetable'>
        <Icon name='clock-o' />
        <span className='timetable-texts'>
          {!hearingItem.published ? (
            <>
              <del>{openMessage}</del>
              (<FormattedMessage id='draftNotPublished' />)
              <br />
              <del>{closeMessage}</del>
            </>
          ) : (
            <>
              {openMessage}
              <br />
              {closeMessage}
            </>
          )}
        </span>
      </div>
    );
  };

  // eslint-disable-next-line class-methods-use-this
  const getComments = (hearingItem, sectionsItem, section, userItem) => {
    const renderWriteCommentLink = () => {
      if (isSectionCommentable(hearingItem, section, userItem)) {
        if (section.plugin_identifier) {
          return null;
        }
        return (
          <div>
            <InternalLink destinationId='comments-section'>
              <FormattedMessage id='headerWriteCommentLink' />
            </InternalLink>
          </div>
        );
      }
      return null;
    };

    const renderCommentsElem = () => (
      <div data-testid='comment-summary' className='hearing-meta__element comment-summary'>
        <Icon name='comment-o' />
        <span className='comment-summary-texts'>
          <div className='commentNumber'>
            <FormattedPlural
              value={hearing.n_comments}
              one={<FormattedMessage id='totalSubmittedComment' values={{ n: hearing.n_comments }} />}
              other={<FormattedMessage id='totalSubmittedComments' values={{ n: hearing.n_comments }} />}
            />
          </div>
          {renderWriteCommentLink()}
        </span>
      </div>
    );

    if (!hasCommentableSections(hearing, sectionsItem, userItem)) {
      return null;
    }
    return renderCommentsElem();
  };

  const getLanguageChanger = () => {
    const languageOptions = keys(hearing.title);

    const translationAvailable = !!getAttr(hearing.title, language, { exact: true });
    const noTranslationMessage = (
      <div className='translation-not-available'>
        <FormattedMessage id='hearingTranslationNotAvailable' />
      </div>
    );

    // Check if only one language is available
    if (!(languageOptions.length > 1)) {
      // If the current language is not the same as the only language available
      if (language !== languageOptions[0]) {
        return (
          <div className='hearing-meta__element language-select'>
            <Icon name='globe' className='user-nav-icon' />
            <span className='language-select__texts'>
              {!translationAvailable && noTranslationMessage}
              <FormattedMessage id='hearingOnlyAvailableIn' />
              &nbsp;
              <Link
                to={{ path: location.pathname, search: stringifyQuery({ lang: languageOptions[0] }) }}
                className='language-select__language'
              >
                <FormattedMessage id={`hearingOnlyAvailableInLang-${languageOptions[0]}`} />
              </Link>
            </span>
          </div>
        );
      }
      // If the current language is the same as the only available language, don't show the language changer at all
      return null;
    }

    /**
     * Returns a language code specific object
     * with correct path and search params that are passed to Link
     * @param {string} code
     * @returns {{path: string, search: string}}
     */
    const langSpecificURL = (code) => {
      const urlObject = {
        path: location.pathname,
        search: location.search,
      };
      if (location.search.includes('lang=')) {
        urlObject.search = location.search.replace(/lang=\w{2}/, stringify({ lang: code }));
      } else if (location.search) {
        urlObject.search += `&${stringify({ lang: code })}`;
      } else {
        urlObject.search += stringifyQuery({ lang: code });
      }

      return urlObject;
    };

    // If multiple languages available for the hearing
    return (
      <div data-testid='language-select' className='hearing-meta__element language-select'>
        <Icon name='globe' className='user-nav-icon' />
        {!translationAvailable && noTranslationMessage}
        {languageOptions.map((code) => (
          <span key={code} className='language-select__texts'>
            {!(code === language) ? (
              <div lang={code}>
                <FormattedMessage id={`hearingAvailable-${code}`} />
                &nbsp;
                <Link to={langSpecificURL(code)} className='language-select__language'>
                  <FormattedMessage id={`hearingAvailableInLang-${code}`} />
                </Link>
              </div>
            ) : null}
          </span>
        ))}
      </div>
    );
  };

  const getEyeTooltip = () => {
    const openingTime = moment(props.hearing.open_at);
    let text = <FormattedMessage id='eyeTooltip' />;
    if (props.hearing.published && openingTime > moment()) {
      const duration = moment.duration(openingTime.diff(moment()));
      const durationAs = duration.asHours() < 24 ? duration.asHours() : duration.asDays();
      // eslint-disable-next-line no-unused-vars
      const differenceText = duration.asHours() < 24 ? 'eyeTooltipOpensHours' : 'eyeTooltipOpensDays';

      text = (
        <span>
          <FormattedMessage id='eyeTooltipOpens' />
          {Math.ceil(durationAs)}
          <FormattedMessage id='differenceText' />
        </span>
      );
    }
    return <Tooltip id='eye-tooltip'>{text}</Tooltip>;
  };

  // eslint-disable-next-line class-methods-use-this
  const writeToClipboard = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.success, 'hearingPreviewLinkSuccess')));
      })
      .catch(() => {
        dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'hearingPreviewLinkFailed')));
      });
  };

  const getPreviewLinkButton = () => (
    <div className='hearing-meta__element'>
      <OverlayTrigger
        placement='bottom'
        overlay={
          <Tooltip id='hearingPreviewLink'>
            <FormattedMessage id='hearingPreviewLinkTooltip'>{(text) => text}</FormattedMessage>
          </Tooltip>
        }
      >
        <Button className='kerrokantasi-btn info' onClick={() => writeToClipboard(hearing.preview_url)}>
          <FormattedMessage id='hearingPreviewLink'>{(text) => text}</FormattedMessage>
        </Button>
      </OverlayTrigger>
    </div>
  );

  const getFavorite = () => {
    if (!user || !user.favorite_hearings) {
      return <div />;
    }
    const isFollowed = user.favorite_hearings.includes(hearing.id);

    const favConfig = {
      icon: isFollowed ? 'heart' : 'heart-o',
      click: isFollowed ? removeFromFavorites : addToFavorites,
      id: isFollowed ? 'removeFavorites' : 'addFavorites',
    };
    return (
      <div className='hearing-meta__element hearing-favorite'>
        <Icon className='icon-adjustment' name={favConfig.icon} />
        <Button className='kerrokantasi-btn secondary' onClick={() => favConfig.click(hearing.slug, hearing.id)}>
          <FormattedMessage id={favConfig.id}>{(txt) => txt}</FormattedMessage>
        </Button>
      </div>
    );
  };

  const mainSection = sections?.find((sec) => sec.type === SectionTypes.MAIN);
  const section = sections?.find((sec) => sec.id === params.sectionId) || mainSection;
  const closureInfoContent = sections?.find((sec) => sec.type === SectionTypes.CLOSURE) ? (
    getAttr(sections?.find((sec) => sec.type === SectionTypes.CLOSURE).content, language)
  ) : (
    intl.formatMessage({ id: 'defaultClosureInfo' })
  );

  return (
    <>
      <div className='header-section'>
        <Grid>
          <div className='hearing-header'>
            <Row>
              <Col md={9}>
                <h1 className='hearing-header-title'>
                  {!isPublic(hearing) && (
                    <OverlayTrigger placement='bottom' overlay={getEyeTooltip()}>
                      <span>
                        <Icon name='eye-slash' />
                        &nbsp;
                      </span>
                    </OverlayTrigger>
                  )}
                  {getAttr(hearing.title, language)}
                </h1>
              </Col>
              {isMainSection(section) && config.showSocialMediaSharing && (
                <Col md={3}>
                  <SocialBar />
                </Col>

                )}
            </Row>
            {isMainSection(section) ? (
              <>
                {!isEmpty(section.abstract) && (
                  <Row>
                    <Col md={9}>
                      <div
                        className='header-abstract lead'
                        dangerouslySetInnerHTML={{ __html: getAttr(section.abstract, language) }}
                      />
                    </Col>
                  </Row>
                )}
                <div className='hearing-meta'>
                  {getTimetableText(hearing)}
                  {getComments(hearing, sections, section, user)}
                  {getLanguageChanger()}
                  {!isEmpty(user) && hearing.closed && moment(hearing.close_at) >= moment() && getPreviewLinkButton()}
                  {getFavorite()}
                </div>
                {!isEmpty(hearing.labels) && (
                  <LabelList className='main-labels' labels={hearing.labels} language={language} />
                )}
              </>
            ) : (
              <Link to={{ path: getHearingURL({ slug: params.hearingSlug }) }}>
                <Icon name='arrow-left' /> <FormattedMessage id='backToHearingMain' />
              </Link>
            )}
          </div>
        </Grid>
      </div>
      {showClosureInfo && <SectionClosureInfo content={closureInfoContent} />}
    </>
  );
}

const mapStateToProps = (state) => ({
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  addToFavorites: (slug, id) => dispatch(addHearingToFavorites(slug, id)),
  removeFromFavorites: (slug, id) => dispatch(removeHearingFromFavorites(slug, id)),
});

HeaderComponent.propTypes = {
  hearing: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  sections: PropTypes.array,
  showClosureInfo: PropTypes.bool,
  user: PropTypes.object,
  addToFavorites: PropTypes.func,
  removeFromFavorites: PropTypes.func,
};

export const UnconnectedHeader = HeaderComponent;

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
