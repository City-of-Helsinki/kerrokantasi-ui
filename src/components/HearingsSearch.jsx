import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { FormattedMessage, intlShape } from 'react-intl';
import Select from 'react-select';
import { isEmpty } from 'lodash';
import { SearchInput } from 'hds-react';

import getAttr from '../utils/getAttr';
import { labelShape } from '../types';
import InternalLink from './InternalLink';

const HearingsSearch = ({ handleSearch, handleSelectLabels, labels, language, searchPhrase, selectedLabels, intl }) => {
  const [searchValue, setSearchValue] = useState(searchPhrase);

  const labelsAsOptions = labels.map(({ label, id }) => ({
    label: getAttr(label, language),
    value: getAttr(label, language),
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
            <FormGroup className='hearings-search__text' controlId='formControlsSearchText'>
              <SearchInput
                className='hearings-search__input'
                label={<FormattedMessage id='searchTitles' />}
                searchButtonAriaLabel={intl.formatMessage({ id: 'searchTitles' })}
                clearButtonAriaLabel={intl.formatMessage({ id: 'clear' })}
                value={searchValue}
                onChange={(newValue) => setSearchValue(newValue)}
                onSubmit={(value) => handleSearch(value)}
              />
            </FormGroup>
            <FormGroup className='hearings-search__label' controlId='formControlsSearchSelect'>
              <ControlLabel>
                <FormattedMessage id='searchLabels' />
              </ControlLabel>
              {!isEmpty(labels) && (
                <Select
                  className="hearings-search__select"
                  multi
                  value={selectedLabels}
                  options={labelsAsOptions}
                  onChange={(value) => handleSelectLabels(value)}
                  placeholder={intl.formatMessage({ id: 'searchPlaceholder' })}
                  id='formControlsSearchSelect'
                />
              )}
            </FormGroup>
          </div>
          <Button className='hearings-search__button' bsStyle='primary' type='submit'>
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
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
};

export default HearingsSearch;
