import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';
import Select from 'react-select';
import getAttr from '../utils/getAttr';
import {get} from 'lodash';
import queryString from 'query-string';

class HearingsSearch extends React.Component {

  constructor(props) {
    super(props);
    const labels = get(queryString.parse(location.search), 'label', []);
    const searchPhrase = get(queryString.parse(location.search), 'search', '');
    this.state = { selectedLabels: labels, searchPhrase };
  }

  handleChange(value) {
    if (value.length !== 0) {
      this.setState({ selectedLabels: value });
    } else {
      this.setState({ selectedLabels: [] });
    }
  }

  render() {
    const {handleSearch, labels, language} = this.props;
    const {selectedLabels, searchPhrase} = this.state;
    const labelsAsOptions = labels.map((label) => {
      return {
        label: getAttr(label.label, language),
        value: getAttr(label.label, language),
        id: label.id,
      };
    });

    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form onSubmit={(event) => handleSearch(event, this.input.value, selectedLabels)}>
            <FormGroup className="hearings-search__text" controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl
                type="text"
                inputRef={(ref) => { this.input = ref; }}
                onChange={(event) => {
                  this.setState({searchPhrase: event.value});
                  // handleSearch(event, event.target.value, selectedLabels);
                }}
                value={searchPhrase}
              />
            </FormGroup>
            <FormGroup className="hearings-search__label" controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchLabels"/></ControlLabel>
              {labels.length !== 0 &&
              <Select
                multi
                value={this.state.selectedLabels}
                options={labelsAsOptions}
                onChange={(value) => {
                  this.handleChange(value);
                  handleSearch(null, this.input.value, value);
                }}
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
  labels: PropTypes.array,
  language: PropTypes.string,
};

export default injectIntl(HearingsSearch);
