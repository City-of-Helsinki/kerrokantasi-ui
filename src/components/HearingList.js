/* eslint-disable react/no-multi-comp */
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Waypoint } from 'react-waypoint';
import { FormattedMessage, FormattedPlural, intlShape } from 'react-intl';
import { Nav, NavItem, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col, Label } from 'react-bootstrap';
import { keys, capitalize } from 'lodash';

import FormatRelativeTime from '../utils/FormatRelativeTime';
import HearingsSearch from './HearingsSearch';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import Link from './LinkWithLang';
import LoadSpinner from './LoadSpinner';
import MouseOnlyLink from './MouseOnlyLink';
import OverviewMap from '../components/OverviewMap';
import config from '../config';
import getAttr from '../utils/getAttr';
import { labelShape } from '../types';
import { getHearingURL, isPublic } from '../utils/hearing';

// eslint-disable-next-line import/no-unresolved
import defaultImage from '@city-images/default-image.svg';

const HEARING_LIST_TABS = {
  LIST: 'list',
  MAP: 'map',
};

const HearingListTabs = ({activeTab, changeTab}) => (
  <Row>
    <Col md={8} mdPush={2}>
      <Nav className="hearing-list__tabs" bsStyle="tabs" activeKey={activeTab}>
        {keys(HEARING_LIST_TABS).map(key => {
          const value = HEARING_LIST_TABS[key];
          return (
            <NavItem key={key} eventKey={value} title={capitalize(value)} onClick={() => changeTab(value)} role="tab">
              <FormattedMessage id={value} />
            </NavItem>
          );
        })}
      </Nav>
    </Col>
  </Row>
);

HearingListTabs.propTypes = {
  activeTab: PropTypes.string,
  changeTab: PropTypes.func,
};

class HearingListFilters extends React.Component {
  state = {
    sortChangeStatusMessages: [],
  }

  sortList = (event) => {
    const { handleSort } = this.props;

    handleSort(event.target.value);

    const newMessage = {
      id: Math.random(),
    };

    this.setState({ sortChangeStatusMessages: [newMessage] });

    // Clear the message after 5 seconds
    setTimeout(() => {
      this.setState({ sortChangeStatusMessages: [] });
    }, 5000);
  }

  render() {
    const { formatMessage } = this.props;

    return (
      <div className="hearing-list__filter-bar clearfix">
        <div className="sr-only">
          {this.state.sortChangeStatusMessages && this.state.sortChangeStatusMessages.map(alert => (
            <div key={alert.id} aria-live="assertive" role="status">
              <FormattedMessage id="orderHasBeenChanged" />
            </div>
          ))}
        </div>
        <FormGroup controlId="formControlsSelect" className="hearing-list__filter-bar-filter">
          <ControlLabel className="hearing-list__filter-bar-label">
            <FormattedMessage id="sort" />
          </ControlLabel>
          <FormControl
            className="select"
            componentClass="select"
            placeholder="select"
            onChange={event => this.sortList(event)}
          >
            <option value="-created_at">{formatMessage({id: 'newestFirst'})}</option>
            <option value="created_at">{formatMessage({id: 'oldestFirst'})}</option>
            <option value="-close_at">{formatMessage({id: 'lastClosing'})}</option>
            <option value="close_at">{formatMessage({id: 'firstClosing'})}</option>
            <option value="-open_at">{formatMessage({id: 'lastOpen'})}</option>
            <option value="open_at">{formatMessage({id: 'firstOpen'})}</option>
            <option value="-n_comments">{formatMessage({id: 'mostCommented'})}</option>
            <option value="n_comments">{formatMessage({id: 'leastCommented'})}</option>
          </FormControl>
        </FormGroup>
      </div>
    );
  }
}

HearingListFilters.propTypes = {
  handleSort: PropTypes.func,
  formatMessage: PropTypes.func,
};

export class HearingListItem extends React.Component {
  render() {
    const { hearing, language, history } = this.props;
    const mainImage = hearing.main_image;
    let mainImageStyle = {
      backgroundImage: `url(${defaultImage})`,
    };
    if (hearing.main_image) {
      mainImageStyle = {
        backgroundImage: 'url("' + mainImage.url + '")',
      };
    }

    const translationAvailable = !!getAttr(hearing.title, language, { exact: true });
    const availableInLanguageMessages = {
      fi: 'Kuuleminen saatavilla suomeksi',
      sv: 'Hörandet tillgängligt på svenska',
      en: 'Questionnaire available in English',
    };

    return (
      <div className="hearing-list-item" role="listitem">
        <MouseOnlyLink
          className="hearing-list-item-image"
          style={mainImageStyle}
          history={history}
          url={getHearingURL(hearing)}
          altText={getAttr(hearing.title, language)}
        />
        <div className="hearing-list-item-content">
          <div className="hearing-list-item-title-wrap">
            <h2 className="h4 hearing-list-item-title">
              <Link to={{ path: getHearingURL(hearing) }}>
                {!isPublic(hearing) ? (
                  <FormattedMessage id="hearingListNotPublished">
                    {(label) => <Icon name="eye-slash" aria-label={label} />}
                  </FormattedMessage>
                ) : null}{' '}
                {getAttr(hearing.title, language)}
              </Link>
            </h2>
            <div className="hearing-list-item-comments">
              <Icon name="comment-o" aria-hidden="true" />&nbsp;{hearing.n_comments}
              <span className="sr-only">
                {hearing.n_comments === 1 ? (
                  <FormattedMessage id="hearingListComment" />
                ) : <FormattedMessage id="hearingListComments" />}
              </span>
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
          <div className="hearing-list-item-labels clearfix">
            <LabelList labels={hearing.labels} className="hearing-list-item-labellist" language={language} />
            {hearing.closed ? (
              <div className="hearing-list-item-closed">
                <Label>
                  <FormattedMessage id="hearingClosed" />
                </Label>
              </div>
            ) : null}
          </div>
          {!translationAvailable && (
            <div className="hearing-card-notice">
              <Icon name="exclamation-circle" aria-hidden="true" />
              <FormattedMessage id="hearingTranslationNotAvailable" />
              {config.languages.map(
                lang =>
                  (getAttr(hearing.title, lang, { exact: true }) ? (
                    <div key={lang} className="language-available-message">
                      {availableInLanguageMessages[lang]}
                    </div>
                  ) : null)
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

HearingListItem.propTypes = {
  hearing: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
};

export const HearingList = ({
  handleSearch,
  handleSelectLabels,
  handleSort,
  hearings,
  hearingCount,
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
  const hasHearings = !isEmpty(hearings);

  const hearingListMap = hearingsToShow ? (
    <Row>
      <Col xs={12}>
        <Helmet title={formatMessage({ id: 'mapView' })} />
        <div className="hearing-list-map map">
          <Checkbox inline readOnly checked={showOnlyOpen} onChange={toggleShowOnlyOpen} style={{marginBottom: 10}}>
            <FormattedMessage id="showOnlyOpen" />
          </Checkbox>
          <OverviewMap
            hearings={hearingsToShow}
            style={{width: '100%', height: isMobile ? '100%' : 600}}
            enablePopups
          />
        </div>
      </Col>
    </Row>
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
          <Row>
            <Col md={8} mdPush={2}>
              {(!isLoading && !hasHearings) && (
                <h3 className="hearing-list__hearing-list-title">
                  <FormattedMessage id="noHearings" />
                </h3>
              )}

              {(hasHearings && activeTab === 'list') && (
                <div>
                  <div className="hearing-list__result-controls">
                    <h3 className="hearing-list__hearing-list-title">
                      {hearingCount}
                      <FormattedPlural
                        value={hearingCount}
                        one={<FormattedMessage id="totalNumHearing" values={{ n: hearingCount }} />}
                        other={<FormattedMessage id="totalNumHearings" values={{ n: hearingCount }} />}
                      />
                    </h3>
                    <HearingListFilters handleSort={handleSort} formatMessage={formatMessage} />
                  </div>

                  <div className="hearing-list">
                    <div role="list">
                      {hearings.map(hearing => (
                        <HearingListItem hearing={hearing} key={hearing.id} language={language} />
                      ))}
                    </div>
                    {isLoading && <LoadSpinner />}
                    {!isLoading && <Waypoint onEnter={handleReachBottom} />}
                  </div>
                </div>
              )}
            </Col>
          </Row>
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
  hearingCount: PropTypes.number,
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
  hearingCount: 0,
};

export default HearingList;
