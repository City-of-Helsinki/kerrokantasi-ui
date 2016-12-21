import React from 'react';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';

class HearingsSearch extends React.Component {

  render() {
    const {labels} = this.props;

    return (
      <div className="hearings-search__container">
        <div className="hearings-search__content">
          <form>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel><FormattedMessage id="searchTitles"/></ControlLabel>
              <FormControl type="text" />
            </FormGroup>
            <FormGroup controlId="formControlsSelect">
              <FormControl componentClass="select" placeholder="select">
                <option value="all"><FormattedMessage id="all"/></option>
                {console.log(labels)}
                {labels.map((label) => <option value={label.label}>{label.label}</option>)}
              </FormControl>
            </FormGroup>
            <Button bsStyle="primary" type="submit"><FormattedMessage id="search"/></Button>
          </form>
        </div>
      </div>
    );
  }
}

HearingsSearch.propTypes = {
  labels: React.PropTypes.object
};

export default injectIntl(HearingsSearch);
