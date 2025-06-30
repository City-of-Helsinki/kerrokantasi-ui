import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'hds-react';

/**
 * Renders a form control component for sorting hearings.
 *
 * @component
 * @param {Function} formatMessage - The function for formatting messages.
 * @param {Function} changeSort - The function for changing the sort option.
 * @returns {JSX.Element} The rendered component.
 */
const HearingFormControl = ({ formatMessage, changeSort }) => {
  const options = [
    { value: '-created_at', label: formatMessage({ id: 'newestFirst' }) },
    { value: 'created_at', label: formatMessage({ id: 'oldestFirst' }) },
    { value: '-close_at', label: formatMessage({ id: 'lastClosing' }) },
    { value: 'close_at', label: formatMessage({ id: 'firstClosing' }) },
    { value: '-n_comments', label: formatMessage({ id: 'mostCommented' }) },
    { value: 'n_comments', label: formatMessage({ id: 'leastCommented' }) },
  ];
  
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  return (
    <div id='formControlsSelect' className='hearing-list__filter-bar-filter'>
      <Select
        id='sort-hearings'
        texts={{
          label: formatMessage({ id: 'sort' }),
        }}
        options={options}
        value={selectedOption}
        onChange={(selected) => {
          changeSort(selected[0].value)
          setSelectedOption(selected[0].value);
        }}
        style={{ marginBottom: 'var(--spacing-s)' }}
      />
    </div>
  );
};

HearingFormControl.propTypes = {
  formatMessage: PropTypes.func,
  changeSort: PropTypes.func,
};

export default HearingFormControl;
