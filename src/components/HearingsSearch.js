import React from 'react';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';

class HearingsSearch extends React.Component {

  render() {
    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl type="text" />
            </FormGroup>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchSubjects"/></ControlLabel>
              <FormControl type="text" />
            </FormGroup>
            <Button bsStyle="primary" type="submit"><FormattedMessage id="search"/></Button>
          </form>
        </div>
      </div>
    );
  }
}

export default injectIntl(HearingsSearch);
