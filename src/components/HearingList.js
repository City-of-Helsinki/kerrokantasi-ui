/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col, Label} from 'react-bootstrap';
import {FormattedMessage, intlShape} from 'react-intl';
import Link from './LinkWithLang';
import FormatRelativeTime from '../utils/FormatRelativeTime';
import Icon from '../utils/Icon';
import {getHearingURL, isPublic} from '../utils/hearing';
import LabelList from './LabelList';
import LoadSpinner from './LoadSpinner';
import getAttr from '../utils/getAttr';
import HearingsSearch from './HearingsSearch';
import config from '../config';
import OverviewMap from '../components/OverviewMap';
import {keys, capitalize} from 'lodash';
import { Waypoint } from 'react-waypoint';
import Helmet from 'react-helmet';

import {labelShape} from '../types';

// eslint-disable-next-line import/no-unresolved
import defaultImage from '@city-images/default-image.svg';

const HEARING_LIST_TABS = {
  LIST: 'list',
  MAP: 'map',
};

const HearingListTabs = ({activeTab, changeTab}) => (
  <Nav className="hearing-list__tabs" bsStyle="tabs" activeKey={activeTab}>
    <NavItem eventKey="3" disabled className="hearing-list__tabs-empty" />
    {keys(HEARING_LIST_TABS).map(key => {
      const value = HEARING_LIST_TABS[key];
      return (
        <NavItem key={key} eventKey={value} title={capitalize(value)} onClick={() => changeTab(value)}>
          <FormattedMessage id={value} />
        </NavItem>
      );
    })}
  </Nav>
);

HearingListTabs.propTypes = {
  activeTab: PropTypes.string,
  changeTab: PropTypes.func,
};

const HearingListFilters = ({handleSort, formatMessage}) => (
  <div className="hearing-list__filter-bar">
    <FormGroup controlId="formControlsSelect" className="hearing-list__filter-bar-filter">
      <div className="select">
        <FormControl componentClass="select" placeholder="select" onChange={event => handleSort(event.target.value)}>
          <option value="-created_at">{formatMessage({id: 'newestFirst'})}</option>
          <option value="created_at">{formatMessage({id: 'oldestFirst'})}</option>
          <option value="-close_at">{formatMessage({id: 'lastClosing'})}</option>
          <option value="close_at">{formatMessage({id: 'firstClosing'})}</option>
          <option value="-open_at">{formatMessage({id: 'lastOpen'})}</option>
          <option value="open_at">{formatMessage({id: 'firstOpen'})}</option>
          <option value="-n_comments">{formatMessage({id: 'mostCommented'})}</option>
          <option value="n_comments">{formatMessage({id: 'leastCommented'})}</option>
        </FormControl>
      </div>
    </FormGroup>
    <ControlLabel className="hearing-list__filter-bar-label">
      <FormattedMessage id="sort" />
    </ControlLabel>
  </div>
);

HearingListFilters.propTypes = {
  handleSort: PropTypes.func,
  formatMessage: PropTypes.func,
};

export class HearingListItem extends React.Component {
  render() {
    const hearing = this.props.hearing;
    const mainImage = hearing.main_image;
    let mainImageStyle = {
      backgroundImage: `url(${defaultImage})`,
    };
    if (hearing.main_image) {
      mainImageStyle = {
        backgroundImage: 'url("' + mainImage.url + '")',
      };
    }

    const {language} = this.props;
    const translationAvailable = !!getAttr(hearing.title, language, {exact: true});
    const availableInLanguageMessages = {
      fi: 'Kuuleminen saatavilla suomeksi',
      sv: 'Hörandet tillgängligt på svenska',
      en: 'Questionnaire available in English',
    };

    return (
      <div className="hearing-list-item">
        {!translationAvailable && (
          <Link to={{path: getHearingURL(hearing)}} className="hearing-card-notice">
            <div className="notice-content">
              <FormattedMessage id="hearingTranslationNotAvailable" />
              {config.languages.map(
                lang =>
                  (getAttr(hearing.title, lang, {exact: true}) ? (
                    <div key={lang} className="language-available-message">
                      {availableInLanguageMessages[lang]}
                    </div>
                  ) : null)
              )}
            </div>
          </Link>
        )}
        <div className="hearing-list-item-image" style={mainImageStyle} />
        <div className="hearing-list-item-content">
          <div className="hearing-list-item-labels">
            <LabelList labels={hearing.labels} className="hearing-list-item-labellist" language={language} />
            <div className="hearing-list-item-closed">
              {hearing.closed ? (
                <Label>
                  <FormattedMessage id="hearingClosed" />
                </Label>
              ) : null}
            </div>
          </div>
          <div className="hearing-list-item-title-wrap">
            <h4 className="hearing-list-item-title">
              {!isPublic(hearing) ? <Icon name="eye-slash" /> : null}{' '}
              <Link to={{path: getHearingURL(hearing)}}>{getAttr(hearing.title, language)}</Link>
            </h4>
            <div className="hearing-list-item-comments">
              <Icon name="comment-o" />&nbsp;{hearing.n_comments}
            </div>
          </div>
          <div className="hearing-list-item-times">
            <div>
              <FormatRelativeTime messagePrefix="timeOpen" timeVal={hearing.open_at} />
            </div>
            <div>
              <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HearingListItem.propTypes = {
  hearing: PropTypes.object,
  language: PropTypes.string,
};

export const HearingList = ({
  handleSearch,
  handleSelectLabels,
  handleSort,
  hearings,
  intl: {formatMessage},
  isLoading,
  isMobile,
  labels,
  language,
  onTabChange,
  searchPhrase,
  selectedLabels,
  showOnlyOpen,
  tab: activeTab,
  toggleShowOnlyOpen,
  handleReachBottom,
  intl
}) => {
  const hearingsToShow = !showOnlyOpen ? hearings : hearings.filter(hearing => !hearing.closed);
  const hasHearings = hearings && hearings.length;

  const hearingListMap = hearingsToShow ? (
    <Col xs={12}>
      <Helmet title={formatMessage({ id: 'mapView' })} />
      <div className="hearing-list-map map">
        <Checkbox inline readOnly checked={showOnlyOpen} onChange={toggleShowOnlyOpen} style={{marginBottom: 10}}>
          <FormattedMessage id="showOnlyOpen" />
        </Checkbox>
        <OverviewMap hearings={hearingsToShow} style={{width: '100%', height: isMobile ? '100%' : 600}} enablePopups />
      </div>
    </Col>
  ) : null;

  return (
    <div>
      <section className="page-section--hearings-search">
        <div className="container">
          <Row>
            <Col md={10} mdPush={1}>
              <HearingsSearch
                handleSearch={handleSearch}
                handleSelectLabels={handleSelectLabels}
                labels={labels}
                language={language}
                searchPhrase={searchPhrase}
                selectedLabels={selectedLabels}
                intl={intl}
              />
            </Col>
          </Row>
        </div>
      </section>
      <section className="page-section--hearings-tabs">
        <div className="container">
          <HearingListTabs activeTab={activeTab} changeTab={onTabChange} />
        </div>
      </section>
      <section className="page-section page-section--hearings-list" id="hearings-section">
        <a href="#hearings-search-form" className="sr-only">
          <FormattedMessage id="jumpToSearchForm" />
        </a>
        <div className="container">
          {!isLoading && !hasHearings ? (
            <p>
              <FormattedMessage id="noHearings" />
            </p>
          ) : null}
          {hasHearings && activeTab === 'list' ? (
            <Col md={8} mdPush={2}>
              <div className="hearing-list">
                <HearingListFilters handleSort={handleSort} formatMessage={formatMessage} />
                {hearings.map(hearing => <HearingListItem hearing={hearing} key={hearing.id} language={language} />)}
                {isLoading && <LoadSpinner />}
                {!isLoading && <Waypoint onEnter={handleReachBottom} />}
              </div>
            </Col>
          ) : null}
          {hasHearings && activeTab === 'map' && !isLoading ? hearingListMap : null}
        </div>
      </section>
    </div>
  );
};

HearingList.propTypes = {
  handleSearch: PropTypes.func,
  handleSelectLabels: PropTypes.func,
  handleSort: PropTypes.func,
  hearings: PropTypes.array,
  intl: intlShape.isRequired,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  onTabChange: PropTypes.func,
  searchPhrase: PropTypes.string,
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  showOnlyOpen: PropTypes.bool,
  tab: PropTypes.string,
  toggleShowOnlyOpen: PropTypes.func,
  handleReachBottom: PropTypes.func,
};

HearingList.defaultProps = {
  tab: HEARING_LIST_TABS.LIST,
};

export default HearingList;
