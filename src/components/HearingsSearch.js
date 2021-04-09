import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage, intlShape} from 'react-intl';
import Select from 'react-select';
import {get, isEmpty} from 'lodash';
import getAttr from '../utils/getAttr';
import {labelShape} from '../types';

class HearingsSearch extends React.Component {
  constructor(props) {
    super(props);
    this.hearingFilterSearch = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.routerLocationState.filteredByLabelLink) {
      document.getElementById("allHearingsPageTitle").focus();
    }
  }

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

    const labelsAsOptions = labels.map(({label, id}) => ({
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
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl
                type="text"
                inputRef={(ref) => { this.input = ref; }}
                defaultValue={searchPhrase}
                onBlur={() => handleSearch(this.input.value)}
              />
            </FormGroup>
            <FormGroup className="hearings-search__label" controlId="formControlsSearchSelect">
              <ControlLabel><FormattedMessage id="searchLabels"/></ControlLabel>
              {!isEmpty(labels) && (
                <Select
                  multi
                  value={selectedLabels}
                  options={labelsAsOptions}
                  onChange={(value) => handleSelectLabels(value)}
                  placeholder={intl.formatMessage({id: 'searchPlaceholder'})}
                  id="formControlsSearchSelect"
                  ref={this.hearingFilterSearch}
                />
              )}
            </FormGroup>
            <Button className="hearings-search__button" bsStyle="primary" type="submit">
              <FormattedMessage id="search"/>
            </Button>
            <a href="#hearings-section" className="sr-only">
              <FormattedMessage id="jumpToSearchResults" />
            </a>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  routerLocationState: get(state, 'router.location.state', {}),
});

HearingsSearch.propTypes = {
  handleSearch: PropTypes.func,
  handleSelectLabels: PropTypes.func,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  searchPhrase: PropTypes.string,
  selectedLabels: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  routerLocationState: PropTypes.object,
};

export default connect(mapStateToProps)(HearingsSearch);
