import React from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

const AdminFilterSelector = ({onSelect, options, active}) => (
  <Nav bsStyle="pills" activeKey={active} className="admin-filter-selector" onSelect={onSelect}>
    {options.map((filter) =>
      <NavItem key={filter} eventKey={filter}>
        <FormattedMessage id={filter}/>
      </NavItem>
    )}
  </Nav>
);

AdminFilterSelector.propTypes = {
  active: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
};

export default AdminFilterSelector;
