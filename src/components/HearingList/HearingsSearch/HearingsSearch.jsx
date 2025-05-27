import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { SearchInput, Button, Select } from 'hds-react';

import getAttr from '../../../utils/getAttr';
import { labelShape } from '../../../types';
import InternalLink from '../../InternalLink';

const HearingsSearch = ({ handleSearch, handleSelectLabels, labels, language, searchPhrase, selectedLabels, intl }) => {
  const [searchValue, setSearchValue] = useState(searchPhrase);

  const labelsAsOptions = labels.map(({ label, id }) => ({
    label: getAttr(label, language),
    id,
  }));

  return (
    <div className='hearings-search__container'>
      <div className='hearings-search__content'>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch(searchValue);
          }}
          id='hearings-search-form'
        >
          <div className='hearings-search__controls'>
            <div id='formControlsSearchText' className='hearings-search__text'>
              <SearchInput
                className='hearings-search__input'
                label={<FormattedMessage id='searchTitles' />}
                searchButtonAriaLabel={intl.formatMessage({ id: 'searchTitles' })}
                clearButtonAriaLabel={intl.formatMessage({ id: 'clear' })}
                value={searchValue}
                onChange={(newValue) => setSearchValue(newValue)}
                onSubmit={(value) => handleSearch(value)}
              />
            </div>
            <div id='formControlsSearchSelect' className='hearings-search__label'>
              {!isEmpty(labels) && (
                <Select
                  texts={{
                    label: intl.formatMessage({ id: 'searchLabels' }),
                    placeholder: intl.formatMessage({ id: 'searchPlaceholder' }),
                  }}
                  multiSelect
                  value={selectedLabels}
                  options={labelsAsOptions}
                  noTags
                  onChange={(selected) => handleSelectLabels(selected)}
                  id='formControlsSearchSelect'
                />
              )}
            </div>
          </div>
          <Button className='hearings-search__button kerrokantasi-btn' type='submit'>
            <FormattedMessage id='search' />
          </Button>
          <InternalLink destinationId='hearings-section' srOnly>
            <FormattedMessage id='jumpToSearchResults' />
          </InternalLink>
        </form>
      </div>
    </div>
  );
};

HearingsSearch.propTypes = {
  handleSearch: PropTypes.func,
  handleSelectLabels: PropTypes.func,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  searchPhrase: PropTypes.string,
  selectedLabels: PropTypes.arrayOf(PropTypes.object),
  intl: PropTypes.object,
};

export default HearingsSearch;
