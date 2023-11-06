import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'hds-react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Icon from '../../utils/Icon';
import Link from '../LinkWithLang';
import HearingFormControl from './HearingFormControl';

const Toolbar = ({ loadOwn, openTools, formatMessage, toggleDropdown, toggleHearingCreator, changeSort }) => (
  <>
    <div className='col-md-12 tool-buttons'>

      <Link to={{ path: '/hearing/new' }}>
        <Button theme="kerrokantasi" className="kerrokantasi-btn success">
          <Icon name='plus' aria-hidden />
          &nbsp;&nbsp;
          <FormattedMessage id='createHearing' />
        </Button>
      </Link>
      <Button
        aria-label={formatMessage({ id: 'toolbar' })}
        aria-expanded={openTools}
        aria-haspopup='true'
        onClick={() => toggleDropdown()}
        className="kerrokantasi-btn gear"
      >
        <Icon className={classNames({ active: openTools })} name='gear' size='2x' aria-hidden />
      </Button>
    </div>
    <div className={classNames('tool-dropdown', { open: openTools })}>
      <div className='tool-content'>
        <HearingFormControl changeSort={changeSort} formatMessage={formatMessage} />
        <div className='hearing-radio'>
          {/* eslint-disable-next-line jsx-a11y/label-has-for */}
          <label id='show'>{formatMessage({ id: 'show' })}</label>
          <form>
            <div>
              <label id='orgLabel'>
                <input
                  aria-labelledby='show orgLabel'
                  type='radio'
                  value='org'
                  name='type'
                  id='orgRadio'
                  onChange={toggleHearingCreator}
                  checked={!loadOwn}
                />
                {formatMessage({ id: 'organizationHearings' })}
              </label>
            </div>
            <div>
              <label id='ownLabel'>
                <input
                  aria-labelledby='show ownLabel'
                  type='radio'
                  value='own'
                  name='type'
                  id='ownRadio'
                  onChange={toggleHearingCreator}
                  checked={loadOwn}
                />
                {formatMessage({ id: 'ownHearings' })}
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);

Toolbar.propTypes = {
  loadOwn: PropTypes.bool,
  openTools: PropTypes.bool,
  formatMessage: PropTypes.func,
  toggleDropdown: PropTypes.func,
  toggleHearingCreator: PropTypes.func,
  changeSort: PropTypes.func,
};

export default Toolbar;
