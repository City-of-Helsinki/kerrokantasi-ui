import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';
import getAttr from '../utils/getAttr';
import {labelShape} from '../types';

class HearingsSearch extends React.Component {

  render() {
    const {
      handleSearch,
      labels,
      language,
      searchPhrase,
      selectedLabels
    } = this.props;

    const labelsAsOptions = labels.map(({label, id}) => ({
      label: getAttr(label, language),
      value: getAttr(label, language),
      id,
    }));

    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form onSubmit={(event) => handleSearch(event, this.input.value, selectedLabels)}>
            <FormGroup className="hearings-search__text" controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl
                type="text"
                inputRef={(ref) => { this.input = ref; }}
                defaultValue={searchPhrase}
              />
            </FormGroup>
            <FormGroup className="hearings-search__label" controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchLabels"/></ControlLabel>
              {labels.length !== 0 &&
              <Select
                multi
                value={selectedLabels}
                options={labelsAsOptions}
                onChange={(value) => handleSearch(null, this.input.value, value)}
              />
              }
            </FormGroup>
            <Button className="hearings-search__button" bsStyle="primary" type="submit">
              <FormattedMessage id="search"/>
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

HearingsSearch.propTypes = {
  handleSearch: PropTypes.func,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  searchPhrase: PropTypes.string,
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
};

export default HearingsSearch;
