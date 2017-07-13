import React from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

/**
 * [AdminFilterSelector description]
 * @param {String} active                          [description]
 * @param {String} [messageKey='formattedMessage'] [description]
 * @param {function} onSelect                        [description]
 * @param {Array<String|Object>} options                         [description]
 * @param {String} valueKey                        [description]
 */
const AdminFilterSelector = ({
  active,
  messageKey = 'formattedMessage',
  onSelect,
  options,
  valueKey
}) => {
  let values = options;
  let messages = options;

  if (valueKey) {
    values = options.map((option) => option[valueKey]);
    messages = options.map((option) => option[messageKey]);
  }

  return (
    <Nav bsStyle="pills" activeKey={active} className="admin-filter-selector" onSelect={onSelect}>
      {values.map((filter, index) =>
        <NavItem key={filter} eventKey={filter}>
          <FormattedMessage id={messages[index]}/>
        </NavItem>
      )}
    </Nav>
  );
};

AdminFilterSelector.propTypes = {
  active: PropTypes.string,
  messageKey: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.shape({
      list: PropTypes.string,
      formattedMessage: PropTypes.string,
    }))
  ]),
  valueKey: PropTypes.string,
};

export default AdminFilterSelector;
