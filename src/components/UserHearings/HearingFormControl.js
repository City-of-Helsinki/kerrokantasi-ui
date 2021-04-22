import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import {FormattedMessage} from "react-intl";

const HearingFormControl = ({formatMessage, changeSort}) => {
  return (
    <FormGroup controlId="formControlsSelect" className="hearing-list__filter-bar-filter">
      <ControlLabel className="hearing-list__filter-bar-label">
        <FormattedMessage id="sort" />
      </ControlLabel>
      <FormControl
        className="select"
        componentClass="select"
        placeholder="select"
        onChange={event => changeSort(event)}
      >
        <option value="-created_at">{formatMessage({id: 'newestFirst'})}</option>
        <option value="created_at">{formatMessage({id: 'oldestFirst'})}</option>
        <option value="-close_at">{formatMessage({id: 'lastClosing'})}</option>
        <option value="close_at">{formatMessage({id: 'firstClosing'})}</option>
        <option value="-open_at">{formatMessage({id: 'lastOpen'})}</option>
        <option value="open_at">{formatMessage({id: 'firstOpen'})}</option>
        <option value="-n_comments">{formatMessage({id: 'mostCommented'})}</option>
        <option value="n_comments">{formatMessage({id: 'leastCommented'})}</option>
      </FormControl>
    </FormGroup>
  );
};

HearingFormControl.propTypes = {
  formatMessage: PropTypes.func,
  changeSort: PropTypes.func,
};

export default HearingFormControl;
