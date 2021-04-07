import React from 'react';
import PropTypes from 'prop-types';
import {Button} from "react-bootstrap";
import Icon from "../../utils/Icon";
import Link from "../LinkWithLang";
import classNames from "classnames";
import HearingFormControl from "./HearingFormControl";

const Toolbar = ({loadOwn, openTools, formatMessage, toggleDropdown, toggleHearingCreator, changeSort}) => {
  return (
    <React.Fragment>
      <div className="col-md-12 tool-buttons">
        <div>
          <Link to={{path: '/hearing/new'}} className="btn btn-success">
            <Icon name="plus" aria-hidden/>
            {formatMessage({id: 'createHearing'})}
          </Link>
        </div>
        <Button
          aria-label={formatMessage({id: 'toolbar'})}
          aria-expanded={openTools}
          aria-haspopup="true"
          onClick={() => toggleDropdown()}
        >
          <Icon className={classNames({active: openTools})} name="gear" size="2x" aria-hidden />
        </Button>
      </div>
      <div className={classNames('tool-dropdown', {open: openTools})}>
        <div className="tool-content">
          <HearingFormControl changeSort={changeSort} formatMessage={formatMessage} />
          <div className="hearing-radio">
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label id="show">{formatMessage({id: 'show'})}</label>
            <form>
              <div>
                <label id="orgLabel">
                  <input
                    aria-labelledby="show orgLabel"
                    type="radio"
                    value="org"
                    name="type"
                    id="orgRadio"
                    onChange={toggleHearingCreator}
                    checked={!loadOwn}
                  />
                  {formatMessage({id: 'organizationHearings'})}
                </label>
              </div>
              <div>
                <label id="ownLabel">
                  <input
                    aria-labelledby="show ownLabel"
                    type="radio"
                    value="own"
                    name="type"
                    id="ownRadio"
                    onChange={toggleHearingCreator}
                    checked={loadOwn}
                  />
                  {formatMessage({id: 'ownHearings'})}
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

Toolbar.propTypes = {
  loadOwn: PropTypes.bool,
  openTools: PropTypes.bool,
  formatMessage: PropTypes.func,
  toggleDropdown: PropTypes.func,
  toggleHearingCreator: PropTypes.func,
  changeSort: PropTypes.func,
};

export default Toolbar;
