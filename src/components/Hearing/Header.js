import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Col, Grid, OverlayTrigger, Row, Tooltip, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { injectIntl, FormattedPlural, FormattedMessage, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {notifyError, notifySuccess} from "../../utils/notify";
import FormatRelativeTime from '../../utils/FormatRelativeTime';
import Icon from '../../utils/Icon';
import LabelList from '../../components/LabelList';
import SectionClosureInfo from '../../components/Hearing/Section/SectionClosureInfo';
import SocialBar from '../../components/SocialBar';
import getAttr from '../../utils/getAttr';
import Link from '../LinkWithLang';
import config from '../../config';
import { isPublic, getHearingURL, hasCommentableSections } from "../../utils/hearing";
import { SectionTypes, isMainSection, isSectionCommentable } from '../../utils/section';
import { stringifyQuery } from '../../utils/urlQuery';
import { getSections, getIsHearingPublished, getIsHearingClosed } from '../../selectors/hearing';
import { getUser} from "../../selectors/user";

export class HeaderComponent extends React.Component {
  getTimetableText(hearing) { // eslint-disable-line class-methods-use-this
    const openMessage = <FormatRelativeTime messagePrefix="timeOpen" timeVal={hearing.open_at}/>;
    const closeMessage = <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at}/>;

    return (
      <div className="hearing-meta__element timetable">
        <Icon name="clock-o" />
        <span className="timetable-texts">
          {!hearing.published ? (
            <React.Fragment>
              <del>{openMessage}</del>
              (<FormattedMessage id="draftNotPublished"/>)
              <br />
              <del>{closeMessage}</del>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {openMessage}
              <br />
              {closeMessage}
            </React.Fragment>
          )}
        </span>
      </div>
    );
  }

  getComments = (hearing, sections, section, user) => {
    const renderWriteCommentLink = () => {
      if (isSectionCommentable(hearing, section, user)) {
        if (section.plugin_identifier) {
          return null;
        }
        return (
          <div>
            <AnchorLink offset="100" href="#comments-section">
              <FormattedMessage id="headerWriteCommentLink" />
            </AnchorLink>
          </div>
        );
      }
      return null;
    };

    const renderCommentsElem = () => (
      <div className="hearing-meta__element comment-summary">
        <Icon name="comment-o" />
        <span className="comment-summary-texts">
          <div className="commentNumber">
            <FormattedPlural
              value={hearing.n_comments}
              one={<FormattedMessage id="totalSubmittedComment" values={{ n: hearing.n_comments }} />}
              other={<FormattedMessage id="totalSubmittedComments" values={{ n: hearing.n_comments }} />}
            />
          </div>
          {renderWriteCommentLink()}
        </span>
      </div>
    );

    if (!hasCommentableSections(hearing, sections, user)) {
      return null;
    }
    return renderCommentsElem();
  }

  getLanguageChanger() {
    const {
      activeLanguage,
      hearing,
      history,
      intl,
      location,
    } = this.props;
    const languageOptions = keys(hearing.title);

    const translationAvailable = !!getAttr(hearing.title, activeLanguage, { exact: true });
    const noTranslationMessage = (
      <div className="translation-not-available">
        <FormattedMessage id="hearingTranslationNotAvailable" />
      </div>
    );

    // Check if only one language is available
    if (!(languageOptions.length > 1)) {
      // If the current language is not the same as the only language available
      if (activeLanguage !== languageOptions[0]) {
        return (
          <div className="hearing-meta__element language-select">
            <Icon name="globe" className="user-nav-icon" />
            <span className="language-select__texts">
              {!translationAvailable && noTranslationMessage}
              {intl.formatMessage({ id: 'hearingOnlyAvailableIn' })}&nbsp;
              <a
                href=""
                className="language-select__language"
                onClick={() => {
                  history.push({
                    location: location.pathname,
                    search: stringifyQuery({ lang: languageOptions[0] })
                  });
                }}
              >
                {intl.formatMessage({ id: `hearingOnlyAvailableInLang-${languageOptions[0]}` })}
              </a>
            </span>
          </div>
        );
      }
      // If the current language is the same as the only available language, don't show the language changer at all
      return null;
    }

    // If multiple languages available for the hearing
    return (
      <div className="hearing-meta__element language-select">
        <Icon name="globe" className="user-nav-icon" />
        {!translationAvailable && noTranslationMessage}
        {languageOptions.map((code) =>
          <span key={code} className="language-select__texts">
            {!(code === activeLanguage) ? (
              <div>
                {intl.formatMessage({ id: `hearingAvailable-${code}` })}&nbsp;
                <a
                  href=""
                  className="language-select__language"
                  onClick={() => {
                    history.push({
                      location: location.pathname,
                      search: stringifyQuery({ lang: code })
                    });
                  }}
                >
                  {intl.formatMessage({ id: `hearingAvailableInLang-${code}` })}
                </a>
              </div>
            ) : null}
          </span>
        )}
      </div>
    );
  }

  getEyeTooltip() {
    // eslint-disable-line class-methods-use-this
    const {formatMessage} = this.props.intl;
    const openingTime = moment(this.props.hearing.open_at);
    let text = <FormattedMessage id="eyeTooltip" />;
    if (this.props.hearing.published && openingTime > moment()) {
      const duration = moment.duration(openingTime.diff(moment()));
      const durationAs = duration.asHours() < 24 ? duration.asHours() : duration.asDays();
      const differenceText = duration.asHours() < 24 ? 'eyeTooltipOpensHours' : 'eyeTooltipOpensDays';
      text = `${formatMessage({id: 'eyeTooltipOpens'})} ${Math.ceil(durationAs)} ${formatMessage({
        id: differenceText,
      })}`;
    }
    return <Tooltip id="eye-tooltip">{text}</Tooltip>;
  }
  getPreviewLinkButton() {
    const {hearing} = this.props;
    return (
      <div className="hearing-meta__element">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="hearingPreviewLink">
              <FormattedMessage id="hearingPreviewLinkTooltip">{text => text}</FormattedMessage>
            </Tooltip>}
        >
          <Button bsStyle="info" onClick={() => this.writeToClipboard(hearing.preview_url)}>
            <FormattedMessage id="hearingPreviewLink">{text => text}</FormattedMessage>
          </Button>
        </OverlayTrigger>
      </div>
    );
  }

  writeToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        notifySuccess(<FormattedMessage id="hearingPreviewLinkSuccess">{text => text}</FormattedMessage>);
      })
      .catch(() => {
        notifyError(<FormattedMessage id="hearingPreviewLinkFailed">{text => text}</FormattedMessage>);
      });
  }

  render() {
    const {
      hearing,
      activeLanguage,
      sections,
      match,
      showClosureInfo,
      intl,
      language,
      user,
    } = this.props;

    const mainSection = sections.find(sec => sec.type === SectionTypes.MAIN);
    const section = sections.find(sec => sec.id === match.params.sectionId) || mainSection;
    const closureInfoContent = sections.find(sec => sec.type === SectionTypes.CLOSURE)
      ? getAttr(sections.find(sec => sec.type === SectionTypes.CLOSURE).content, language)
      : intl.formatMessage({ id: 'defaultClosureInfo' });

    return (
      <React.Fragment>
        <div className="header-section">
          <Grid>
            <div className="hearing-header">
              <Row>
                <Col md={9}>
                  <h1 className="hearing-header-title">
                    {!isPublic(hearing) && (
                      <OverlayTrigger placement="bottom" overlay={this.getEyeTooltip()}>
                        <span>
                          <Icon name="eye-slash" />&nbsp;
                        </span>
                      </OverlayTrigger>
                    )}
                    {getAttr(hearing.title, activeLanguage)}
                  </h1>
                </Col>
                {(isMainSection(section) && config.showSocialMediaSharing) && (
                  <Col md={3}>
                    <SocialBar />
                  </Col>
                )}
              </Row>
              {isMainSection(section) ? (
                <React.Fragment>
                  {!isEmpty(section.abstract) &&
                    <Row>
                      <Col md={9}>
                        <div
                          className="header-abstract lead"
                          dangerouslySetInnerHTML={{ __html: getAttr(section.abstract, activeLanguage) }}
                        />
                      </Col>
                    </Row>
                  }
                  <div className="hearing-meta">
                    {this.getTimetableText(hearing)}
                    {this.getComments(hearing, sections, section, user)}
                    {this.getLanguageChanger()}
                    {(!isEmpty(user) && hearing.closed && moment(hearing.close_at) >= moment()) && (
                      this.getPreviewLinkButton()
                    )}
                  </div>
                  {!isEmpty(hearing.labels) && (
                    <LabelList className="main-labels" labels={hearing.labels} language={activeLanguage} />
                  )}
                </React.Fragment>
              ) : (
                <Link to={{path: getHearingURL(hearing)}}>
                  <Icon name="arrow-left" /> <FormattedMessage id="backToHearingMain" />
                </Link>
              )}
            </div>
          </Grid>
        </div>
        {showClosureInfo && <SectionClosureInfo content={closureInfoContent} />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  sections: getSections(state, ownProps.match.params.hearingSlug),
  showClosureInfo: getIsHearingClosed(state, ownProps.match.params.hearingSlug)
    && getIsHearingPublished(state, ownProps.match.params.hearingSlug),
  user: getUser(state),
});

const mapDispatchToProps = () => ({});

HeaderComponent.propTypes = {
  activeLanguage: PropTypes.string,
  hearing: PropTypes.object,
  history: PropTypes.object,
  intl: intlShape.isRequired,
  language: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object,
  sections: PropTypes.array,
  showClosureInfo: PropTypes.bool,
  user: PropTypes.object,
};

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)));
