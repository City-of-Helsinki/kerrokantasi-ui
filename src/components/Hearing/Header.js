import React from 'react';
import {Col, Row, OverlayTrigger, Tooltip, Grid, DropdownButton, MenuItem} from 'react-bootstrap';
import {injectIntl, FormattedPlural, FormattedMessage, intlShape} from 'react-intl';
import Slider from 'react-slick';
import FormatRelativeTime from '../../utils/FormatRelativeTime';
import LabelList from '../../components/LabelList';
import SocialBar from '../../components/SocialBar';
import Icon from '../../utils/Icon';
import getAttr from '../../utils/getAttr';
import {isPublic} from "../../utils/hearing";
import PropTypes from 'prop-types';
import keys from 'lodash/keys';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {stringifyQuery} from '../../utils/urlQuery';
import {withRouter} from 'react-router-dom';

export class HeaderComponent extends React.Component {
  getTimetableText(hearing) { // eslint-disable-line class-methods-use-this
    const openMessage = <FormatRelativeTime messagePrefix="timeOpen" timeVal={hearing.open_at}/>;
    const closeMessage = <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at}/>;
    if (!hearing.published) {
      return (
        <div className="timetable">
          <Icon name="clock-o"/>
          <del>{openMessage}</del>
          (<FormattedMessage id="draftNotPublished"/>)
          <br/>
          <Icon name="clock-o"/>
          <del>{closeMessage}</del>
        </div>
      );
    }
    return (
      <div className="timetable">
        <Icon name="clock-o"/> {openMessage}
        <br/>
        <Icon name="clock-o"/> {closeMessage}
      </div>
    );
  }

  getLanguageChanger() {
    const {hearing, activeLanguage, location, history, intl} = this.props;
    const languageOptions = keys(hearing.title);
    return languageOptions.length > 1
      ? (
        <DropdownButton
          className="language-switcher"
          id="language"
          eventKey="language"
          title={<span><Icon name="globe" className="user-nav-icon"/>{activeLanguage} </span>}
        >
          {languageOptions.map((code) =>
            <MenuItem
              href=""
              key={code}
              className="language-switcher__language"
              onClick={() => {
                history.push({
                  location: location.pathname,
                  search: stringifyQuery({lang: code})
                });
              }}
              active={code === activeLanguage}
            >
              {intl.formatMessage({id: `lang-${code}`})}
            </MenuItem>)}
        </DropdownButton>
      )
      : null;
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

  toPhaseFirstHearing = (phase) => {
    const { hearings } = phase;
    const {history} = this.props;

    if (hearings.length > 0) {
      const hearingSlug = hearings[0];
      history.push(`/${hearingSlug}${history.location.search}`);
    }
  }

  renderPhases = (phases) => {
    const {activeLanguage} = this.props;
    const activePhaseIndex = findIndex(phases, (phase) => phase.is_active);
    const numberOfItems = phases.length;

    const listCanFit = (size) => numberOfItems <= size;

    const getSettingForSize = (size) => ({
      slidesToShow: size,
      arrows: !listCanFit(size),
      centerMode: !listCanFit(size),
      initialSlide: listCanFit(size) ? 0 : activePhaseIndex
    });

    const responsiveSetting = [{
      breakpoint: 768,
      settings: getSettingForSize(2)
    },
    {
      breakpoint: 992,
      settings: getSettingForSize(3)
    },
    {
      breakpoint: 1200,
      settings: getSettingForSize(5)
    }];

    return (
      <Slider
        responsive={responsiveSetting}
        className="project-phases-list"
        infinite={false}
        {...getSettingForSize(6)}
      >
        {phases.map((phase, index) => (
          <div className="phases-list-item" key={phase.id}>
            <button className={`phase-order ${phase.is_active ? 'active-phase' : ''}`} onClick={() => this.toPhaseFirstHearing(phase)}>
              {index + 1}
            </button>
            <span className="phase-title">{getAttr(phase.title, activeLanguage)}</span>
            <span>{getAttr(phase.description, activeLanguage)}</span>
            <span className="phase-schedule">{getAttr(phase.schedule, activeLanguage)}</span>
            <div className={`
                ${numberOfItems > 1 ? 'phase-process-line' : ''}
                ${index === 0 && numberOfItems > 1 ? 'phase-process-line-first' : ''}
                ${index === numberOfItems - 1 && numberOfItems > 1 ? 'phase-process-line-last' : ''}
              `}
            />
          </div>
        ))}
      </Slider>
    );
  }

  render() {
    const { hearing, activeLanguage, reportUrl } = this.props;
    const project = get(hearing, 'project');
    const phases = get(project, 'phases') || [];
    return (
      <div className="header-section">
        <Grid>
          <div className="hearing-header">
            <h1>
              {!isPublic(hearing)
                ? <OverlayTrigger placement="bottom" overlay={this.getEyeTooltip()}><Icon name="eye-slash"/></OverlayTrigger>
                : null}
              {' '}
              {getAttr(hearing.title, activeLanguage)}
            </h1>
            <Row className="hearing-meta">
              <Col xs={12}>
                <LabelList className="main-labels" labels={hearing.labels} language={activeLanguage} />
              </Col>
              <Col xs={12} sm={6}>
                {this.getTimetableText(hearing)}
                <SocialBar />
              </Col>
              <Col xs={12} sm={6}>
                <div className="comment-summary">
                  {hearing.n_comments ? (
                    <div className="commentNumber">
                      <Icon name="comment-o"/> {' '}
                      <FormattedPlural
                        value={hearing.n_comments}
                        one={<FormattedMessage id="totalSubmittedComment" values={{n: hearing.n_comments}}/>}
                        other={<FormattedMessage id="totalSubmittedComments" values={{n: hearing.n_comments}}/>}
                      />
                    </div>
                  ) : null}
                  {reportUrl ? (
                    <div className="report-download">
                      <a href={reportUrl}>
                        <small>
                          <Icon name="download" /> <FormattedMessage id="downloadReport" />
                        </small>
                      </a>
                    </div>
                  ) : null}
                </div>
                {this.getLanguageChanger()}
              </Col>
            </Row>
            <Row className="hearing-project">
              <div className="hearing-project">
                {isEmpty(project) ? null : <h5><FormattedMessage id="project"/> {getAttr(project.title, activeLanguage)}</h5>}
                {this.renderPhases(phases)}
              </div>
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}

HeaderComponent.propTypes = {
  hearing: PropTypes.object,
  reportUrl: PropTypes.string,
  activeLanguage: PropTypes.string,
  intl: intlShape.isRequired,
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(injectIntl(HeaderComponent));
