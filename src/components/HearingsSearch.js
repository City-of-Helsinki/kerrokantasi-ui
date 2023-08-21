import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { FormattedMessage, intlShape } from 'react-intl';
import Select from 'react-select';
import { isEmpty } from 'lodash';

import getAttr from '../utils/getAttr';
import { labelShape } from '../types';
import InternalLink from './InternalLink';

class HearingsSearch extends React.Component {
  render() {
    const {
      handleSearch,
      handleSelectLabels,
      labels,
      language,
      searchPhrase,
      selectedLabels,
      intl
    } = this.props;

    const labelsAsOptions = labels.map(({ label, id }) => ({
      label: getAttr(label, language),
      value: getAttr(label, language),
      id,
    }));

    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form
            onSubmit={(event) => { event.preventDefault(); handleSearch(this.input.value, true); }}
            id="hearings-search-form"
          >
            <FormGroup className="hearings-search__text" controlId="formControlsSearchText">
              <ControlLabel><FormattedMessage id="searchTitles" /></ControlLabel>
              <FormControl
                type="text"
                inputRef={(ref) => { this.input = ref; }}
                defaultValue={searchPhrase}
                onBlur={() => handleSearch(this.input.value)}
              />
            </FormGroup>
            <FormGroup className="hearings-search__label" controlId="formControlsSearchSelect">
              <ControlLabel><FormattedMessage id="searchLabels" /></ControlLabel>
              {!isEmpty(labels) && (
                <Select
                  multi
                  value={selectedLabels}
                  options={labelsAsOptions}
                  onChange={(value) => handleSelectLabels(value)}
                  placeholder={intl.formatMessage({ id: 'searchPlaceholder' })}
                  id="formControlsSearchSelect"
                />
              )}
            </FormGroup>
            <Button className="hearings-search__button" bsStyle="primary" type="submit">
              <FormattedMessage id="search" />
            </Button>
            <InternalLink destinationId="hearings-section" srOnly>
              <FormattedMessage id="jumpToSearchResults" />
            </InternalLink>
          </form>
        </div>
      </div>
    );
  }
}

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
