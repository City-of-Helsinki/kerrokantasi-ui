import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'hds-react';
import { FormattedMessage } from 'react-intl';
import { uniqueId } from 'lodash';

const HearingListFilters = ({ handleSort, formatMessage }) => {
  const [sortChangeStatusMessages, setSortChangeStatusMessages] = useState([]);

  const sortList = (value) => {
    const sortBy = value.replace('_from_open', '').replace('_from_closed', '');
    const showOnlyOpen = value.indexOf('_from_open') !== -1;
    const showOnlyClosed = value.indexOf('_from_closed') !== -1;

    handleSort(sortBy, showOnlyOpen, showOnlyClosed);

    const newMessage = {
      id: uniqueId(),
    };

    setSortChangeStatusMessages([newMessage]);

    // Clear the message after 5 seconds
    setTimeout(() => {
      setSortChangeStatusMessages([]);
    }, 5000);
  };

  const sortOptions = [
    { value: '-created_at', label: formatMessage({ id: 'newestFirst' }) },
    { value: 'created_at', label: formatMessage({ id: 'oldestFirst' }) },
    { value: '-close_at_from_open', label: formatMessage({ id: 'lastClosing' }) },
    { value: 'close_at_from_open', label: formatMessage({ id: 'firstClosing' }) },
    { value: '-close_at_from_closed', label: formatMessage({ id: 'lastClosed' }) },
    { value: '-n_comments', label: formatMessage({ id: 'mostCommented' }) },
    { value: 'n_comments', label: formatMessage({ id: 'leastCommented' }) },
  ];

  return (
    <div className='hearing-list__filter-bar clearfix'>
      <div className='sr-only'>
        {sortChangeStatusMessages?.map((alert) => (
          <div key={alert.id} aria-live='assertive' role='status'>
            <FormattedMessage id='orderHasBeenChanged' />
          </div>
        ))}
      </div>
      <div id='formControlsSelect' className='hearing-list__filter-bar-filter'>
        <Select
          label={<FormattedMessage id='sort' />}
          onChange={(selected) => sortList(selected[0].value)}
          defaultValue={sortOptions[0]}
          options={sortOptions}
        />
      </div>
    </div>
  );
};

HearingListFilters.propTypes = {
  handleSort: PropTypes.func,
  formatMessage: PropTypes.func,
};

export default HearingListFilters;
