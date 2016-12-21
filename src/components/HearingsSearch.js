import React from 'react';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';

class HearingsSearch extends React.Component {

  render() {
    const {handleSearch} = this.props;
    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form onSubmit={(event) => handleSearch(event, this.input.value)}>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl
                type="text"
                inputRef={(ref) => { this.input = ref; }}
                onChange={(event) => event.target.value === '' && handleSearch(event)}
              />
            </FormGroup>
            <Button bsStyle="primary" type="submit"><FormattedMessage id="search"/></Button>
          </form>
        </div>
      </div>
    );
  }
}

HearingsSearch.propTypes = {
  handleSearch: React.PropTypes.func
};

export default injectIntl(HearingsSearch);
