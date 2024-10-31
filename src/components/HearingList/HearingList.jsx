/* eslint-disable react/forbid-prop-types */
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Waypoint } from 'react-waypoint';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import { keys } from 'lodash';
import { Checkbox as HDSCheckbox, Tabs as HDSTabs } from 'hds-react';

import HearingsSearch from './HearingsSearch/HearingsSearch';
import LoadSpinner from '../LoadSpinner';
import OverviewMap from '../OverviewMap';
import { labelShape } from '../../types';
import InternalLink from '../InternalLink';
import HearingListFilters from './HearingListFilters/HearingListFilters';
import HearingListItem from './HearingListItem/HearingListItem';

const HEARING_LIST_TABS = {
  LIST: 'list',
  MAP: 'map',
};

const HearingList = ({
  handleSearch,
  handleSelectLabels,
  handleSort,
  hearings,
  hearingCount,
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
    <div className='haring-list-map-container'>
      <Helmet title={formatMessage({ id: 'mapView' })} />
      <div className='hearing-list-map map'>
        <HDSCheckbox
          label={<FormattedMessage id='showOnlyOpen' />}
          readOnly
          checked={showOnlyOpen}
          onChange={toggleShowOnlyOpen}
          style={{ marginBottom: 'var(--spacing-s)' }}
        />
        <OverviewMap
          hearings={hearingsToShow}
          style={{ width: '100%', height: isMobile ? '100%' : 600 }}
          enablePopups
        />
      </div>
    </div>
  ) : null;

  const initiallyActiveTab = Object.values(HEARING_LIST_TABS).findIndex((tab) => tab === activeTab);

  const jumpLink = (
    <InternalLink destinationId='hearings-search-form' srOnly>
      <FormattedMessage id='jumpToSearchForm' />
    </InternalLink>
  );
  const noHearings = !isLoading && !hasHearings && (
    <h2 className='hearing-list__hearing-list-title'>
      <FormattedMessage id='noHearings'>{(txt) => txt}</FormattedMessage>
    </h2>
  );

  return (
    <section className='hearings-list'>
      <section className='page-section--hearings-search'>
        <HearingsSearch
          handleSearch={handleSearch}
          handleSelectLabels={handleSelectLabels}
          labels={labels}
          language={language}
          searchPhrase={searchPhrase}
          selectedLabels={selectedLabels}
          intl={intl}
        />
      </section>
      <section className='hearing-list-tabs'>
        <HDSTabs
          initiallyActiveTab={initiallyActiveTab}
          theme={{
            '--tab-min-width': 'auto',
            '--tab-color': 'var(--color-black)',
            '--tab-active-border-color': 'var(--color-white)',
            '--tab-focus-outline-size': '0',
            '--tab-active-border-size': '2px',
            '--tablist-border-color': 'transparent',
          }}
        >
          <HDSTabs.TabList className='page-section--hearings-tabs'>
            {keys(HEARING_LIST_TABS).map((key) => {
              const value = HEARING_LIST_TABS[key];

              return (
                <HDSTabs.Tab key={key} onClick={() => onTabChange(value)}>
                  <FormattedMessage id={value} />
                </HDSTabs.Tab>
              );
            })}
          </HDSTabs.TabList>
          <HDSTabs.TabPanel className='hearings-list-tab-panel'>
            <section id='hearings-section' className='hearings-list-tab-panel-container'>
              {jumpLink}
              {noHearings}

              {hasHearings && (
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

                  <ul className='hearing-list'>
                    {hearings.map((hearing) => (
                      <HearingListItem
                        hearing={hearing}
                        key={hearing.id}
                        language={language}
                        formatTime={formatTime}
                        formatDate={formatDate}
                      />
                    ))}
                  </ul>
                  {isLoading && <LoadSpinner />}
                  {!isLoading && <Waypoint onEnter={handleReachBottom} />}
                </div>
              )}
            </section>
          </HDSTabs.TabPanel>
          <HDSTabs.TabPanel className='hearings-list-tab-panel'>
            <section id='hearings-section' className='hearings-list-tab-panel-container'>
              {jumpLink}
              {noHearings}
              {isLoading && <LoadSpinner />}
              {hasHearings && !isLoading ? hearingListMap : null}
            </section>
          </HDSTabs.TabPanel>
        </HDSTabs>
      </section>
    </section>
  );
};

HearingList.propTypes = {
  handleSearch: PropTypes.func,
  handleSelectLabels: PropTypes.func,
  handleSort: PropTypes.func,
  hearings: PropTypes.array,
  hearingCount: PropTypes.number,
  intl: PropTypes.object,
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
