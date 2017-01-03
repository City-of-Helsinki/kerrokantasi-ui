import React from 'react';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';
import Select from 'react-select';

class HearingsSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = { selectedLabels: [] };
  }

  render() {
    const {handleSearch, labels} = this.props;
    const {selectedLabels} = this.state;
    const multiple = true;
    const labelsAsOptions = labels.map((label) => { return {label: label.label, value: label.label}; });

    const handleChange = (value) => {
      this.setState({ selectedLabels: value });
    };

    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form onSubmit={(event) => handleSearch(event, this.input.value, selectedLabels)}>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl
                type="text"
                inputRef={(ref) => { this.input = ref; }}
                onChange={(event) => event.target.value === '' && handleSearch(event)}
              />
            </FormGroup>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchLabels"/></ControlLabel>
              {labels.length !== 0 &&
              <Select multi={multiple} value={this.state.selectedLabels} options={labelsAsOptions} onChange={(value) => handleChange(value)} />
              }
            </FormGroup>
            <Button bsStyle="primary" type="submit"><FormattedMessage id="search"/></Button>
          </form>
        </div>
      </div>
    );
  }
}

HearingsSearch.propTypes = {
  handleSearch: React.PropTypes.func,
  handleLabelSearch: React.PropTypes.func,
  labels: React.PropTypes.object
};

export default injectIntl(HearingsSearch);
