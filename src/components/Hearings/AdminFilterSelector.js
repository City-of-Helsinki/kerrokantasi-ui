import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../utils/Icon';
import {Nav, NavItem} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

/**
 * [AdminFilterSelector description]
 * @param {object} props
 * @param {String} props.active
 * @param {function} props.onSelect
 * @param {Array<String|Object>} props.options
 */
const AdminFilterSelector = ({
  active,
  onSelect,
  options,
}) => {
  return (
    <Nav activeKey={active} bsStyle="pills" className="admin-filter-selector">
      {options.map((filter) => {
        const {list, iconName, formattedMessage, role} = filter;
        // NavItem role is button by default if filter.role doesnt exist
        return (
          <NavItem key={list} eventKey={list} onSelect={onSelect} role={role}>
            <Icon name={iconName} aria-hidden />
            <FormattedMessage id={formattedMessage}>{txt => txt}</FormattedMessage>
          </NavItem>
        );
      })}
    </Nav>
  );
};

AdminFilterSelector.propTypes = {
  active: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.shape({
      list: PropTypes.string,
      formattedMessage: PropTypes.string,
    }))
  ]),
};

export default AdminFilterSelector;
