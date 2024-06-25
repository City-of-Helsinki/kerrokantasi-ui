/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Waypoint } from 'react-waypoint';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import { Nav, NavItem, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col, Label } from 'react-bootstrap';
import { keys, capitalize } from 'lodash';
import defaultImage from '@city-images/default-image.svg';

import HearingsSearch from './HearingsSearch';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import Link from './LinkWithLang';
import LoadSpinner from './LoadSpinner';
import MouseOnlyLink from './MouseOnlyLink';
import OverviewMap from './OverviewMap';
import config from '../config';
import getAttr from '../utils/getAttr';
import { labelShape } from '../types';
import { getHearingURL, isPublic } from '../utils/hearing';
import InternalLink from './InternalLink';

const HEARING_LIST_TABS = {
  LIST: 'list',
  MAP: 'map',
};

const HearingListTabs = ({ activeTab, changeTab }) => (
  <Row>
    <Col md={8} mdPush={2}>
      <Nav className='hearing-list__tabs' bsStyle='tabs' activeKey={activeTab} role='tablist'>
        {keys(HEARING_LIST_TABS).map((key) => {
          const value = HEARING_LIST_TABS[key];
          return (
            <NavItem key={key} eventKey={value} title={capitalize(value)} onClick={() => changeTab(value)} role='tab'>
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
  constructor() {
    super();

    this.state = {
      sortChangeStatusMessages: [],
    };
  }

  sortList = (event) => {
    const { handleSort } = this.props;
    const { value } = event.target;
    const sortBy = value.replace('_from_open', '').replace('_from_closed', '');
    const showOnlyOpen = value.indexOf('_from_open') !== -1;
    const showOnlyClosed = value.indexOf('_from_closed') !== -1;

    handleSort(sortBy, showOnlyOpen, showOnlyClosed);

    const newMessage = {
      id: Math.random(),
    };

    this.setState({ sortChangeStatusMessages: [newMessage] });

    // Clear the message after 5 seconds
    setTimeout(() => {
      this.setState({ sortChangeStatusMessages: [] });
    }, 5000);
  };

  render() {
    const { formatMessage } = this.props;

    return (
      <div className='hearing-list__filter-bar clearfix'>
        <div className='sr-only'>
          {this.state.sortChangeStatusMessages &&
            this.state.sortChangeStatusMessages.map((alert) => (
              <div key={alert.id} aria-live='assertive' role='status'>
                <FormattedMessage id='orderHasBeenChanged' />
              </div>
            ))}
        </div>
        <FormGroup controlId='formControlsSelect' className='hearing-list__filter-bar-filter'>
          <ControlLabel className='hearing-list__filter-bar-label'>
            <FormattedMessage id='sort' />
          </ControlLabel>
          <FormControl
            className='select'
            componentClass='select'
            placeholder='select'
            onChange={(event) => this.sortList(event)}
          >
            <option value='-created_at'>{formatMessage({ id: 'newestFirst' })}</option>
            <option value='created_at'>{formatMessage({ id: 'oldestFirst' })}</option>
            <option value='-close_at_from_open'>{formatMessage({ id: 'lastClosing' })}</option>
            <option value='close_at_from_open'>{formatMessage({ id: 'firstClosing' })}</option>
            <option value='-close_at_from_closed'>{formatMessage({ id: 'lastClosed' })}</option>
            <option value='-n_comments'>{formatMessage({ id: 'mostCommented' })}</option>
            <option value='n_comments'>{formatMessage({ id: 'leastCommented' })}</option>
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

export const HearingListItem = (props) => {
  const { hearing, language, history, formatTime, formatDate } = props;
  const mainImage = hearing.main_image;
  let mainImageStyle = {
    backgroundImage: `url(${defaultImage})`,
  };
  if (hearing.main_image) {
    mainImageStyle = {
      backgroundImage: `url("${mainImage.url}")`,
    };
  }

  const translationAvailable = !!getAttr(hearing.title, language, { exact: true });
  const availableInLanguageMessages = {
    fi: 'Kuuleminen saatavilla suomeksi',
    sv: 'Hörandet tillgängligt på svenska',
    en: 'Questionnaire available in English',
  };

  // Preparing the dates for translation.
  const isPast = (time) => new Date(time).getTime() < new Date().getTime();
  const openTime = formatTime(hearing.open_at, { hour: '2-digit', minute: '2-digit' });
  const openDate = formatDate(hearing.open_at, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const closeTime = formatTime(hearing.close_at, { hour: '2-digit', minute: '2-digit' });
  const closeDate = formatDate(hearing.close_at, { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Translation ID's for ITIL translation values
  const openMessageId = `timeOpen${isPast(hearing.open_at) ? 'Past' : 'Future'}WithValues`;
  const closeMessageId = `timeClose${isPast(hearing.close_at) ? 'Past' : 'Future'}WithValues`;

  return (
    <div className='hearing-list-item' role='listitem'>
      <MouseOnlyLink
        className='hearing-list-item-image'
        style={mainImageStyle}
        history={history}
        url={getHearingURL(hearing)}
        altText={getAttr(hearing.title, language)}
      />
      <div className='hearing-list-item-content'>
        <div className='hearing-list-item-title-wrap'>
          <h2 className='h4 hearing-list-item-title'>
            <Link to={{ path: getHearingURL(hearing) }}>
              {!isPublic(hearing) ? (
                <FormattedMessage id='hearingListNotPublished'>
                  {(label) => <Icon name='eye-slash' aria-label={label} />}
                </FormattedMessage>
              ) : null}{' '}
              {getAttr(hearing.title, language)}
            </Link>
          </h2>
          <div className='hearing-list-item-comments'>
            <Icon name='comment-o' aria-hidden='true' />
            &nbsp;{hearing.n_comments}
            <span className='sr-only'>
              {hearing.n_comments === 1 ? (
                <FormattedMessage id='hearingListComment' />
              ) : (
                <FormattedMessage id='hearingListComments' />
              )}
            </span>
          </div>
        </div>
        <div className='hearing-list-item-times'>
          <div>
            <FormattedMessage id={openMessageId} values={{ time: openTime, date: openDate }} />
          </div>
          <div>
            <FormattedMessage id={closeMessageId} values={{ time: closeTime, date: closeDate }} />
          </div>
        </div>
        <div className='hearing-list-item-labels clearfix'>
          <LabelList labels={hearing.labels} className='hearing-list-item-labellist' language={language} />
          {hearing.closed ? (
            <div className='hearing-list-item-closed'>
              <Label>
                <FormattedMessage id='hearingClosed' />
              </Label>
            </div>
          ) : null}
        </div>
        {!translationAvailable && (
          <div className='hearing-card-notice'>
            <Icon name='exclamation-circle' aria-hidden='true' />
            <FormattedMessage id='hearingTranslationNotAvailable' />
            {config.languages.map((lang) =>
              getAttr(hearing.title, lang, { exact: true }) ? (
                <div className='language-available-message' key={lang} lang={lang}>
                  {availableInLanguageMessages[lang]}
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

HearingListItem.propTypes = {
  hearing: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
  formatTime: PropTypes.func,
  formatDate: PropTypes.func,
};

export const HearingList = ({
  handleSearch,
  handleSelectLabels,
  handleSort,
  hearings,
  hearingCount = 0,
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
  intl,
}) => {
  const hearingsToShow = !showOnlyOpen ? hearings : hearings.filter((hearing) => !hearing.closed);
  const hasHearings = !isEmpty(hearings);

  const { formatMessage, formatTime, formatDate } = intl;

  const hearingListMap = hearingsToShow ? (
    <Row>
      <Col xs={12}>
        <Helmet title={formatMessage({ id: 'mapView' })} />
        <div className='hearing-list-map map'>
          <Checkbox inline readOnly checked={showOnlyOpen} onChange={toggleShowOnlyOpen} style={{ marginBottom: 10 }}>
            <FormattedMessage id='showOnlyOpen' />
          </Checkbox>
          <OverviewMap
            hearings={hearingsToShow}
            style={{ width: '100%', height: isMobile ? '100%' : 600 }}
            enablePopups
          />
        </div>
      </Col>
    </Row>
  ) : null;

  return (
    <div>
      <section className='page-section--hearings-search'>
        <div className='container'>
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
      <section className='page-section--hearings-tabs'>
        <div className='container'>
          <HearingListTabs activeTab={activeTab} changeTab={onTabChange} />
        </div>
      </section>
      <section className='page-section page-section--hearings-list' id='hearings-section'>
        <div className='container'>
          <Row>
            <Col md={8} mdPush={2}>
              <InternalLink destinationId='hearings-search-form' srOnly>
                <FormattedMessage id='jumpToSearchForm' />
              </InternalLink>
              {!isLoading && !hasHearings && (
                <h2 className='hearing-list__hearing-list-title'>
                  <FormattedMessage id='noHearings'>{(txt) => txt}</FormattedMessage>
                </h2>
              )}

              {hasHearings && activeTab === 'list' && (
                <div>
                  <div className='hearing-list__result-controls'>
                    <h2 className='hearing-list__hearing-list-title'>
                      <FormattedPlural
                        value={hearingCount}
                        one={
                          <FormattedMessage id='totalNumHearing' values={{ n: hearingCount }}>
                            {(txt) => txt}
                          </FormattedMessage>
                        }
                        other={
                          <FormattedMessage id='totalNumHearings' values={{ n: hearingCount }}>
                            {(txt) => txt}
                          </FormattedMessage>
                        }
                      >
                        {(txt) => txt}
                      </FormattedPlural>
                    </h2>
                    <HearingListFilters handleSort={handleSort} formatMessage={formatMessage} />
                  </div>

                  <div className='hearing-list'>
                    <div role='list'>
                      {hearings.map((hearing) => (
                        <HearingListItem
                          hearing={hearing}
                          key={hearing.id}
                          language={language}
                          formatTime={formatTime}
                          formatDate={formatDate}
                        />
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
  intl: PropTypes.object,
};

export default HearingList;
