import React from 'react';
import PropTypes from 'prop-types';
import { SelectionGroup, RadioButton } from 'hds-react';
import { FormattedMessage, useIntl } from 'react-intl';

/**
 * [AdminFilterSelector description]
 * @param {object} props
 * @param {String} props.active
 * @param {function} props.onSelect
 * @param {Array<String|Object>} props.options
 */
const AdminFilterSelector = ({ active, onSelect, options }) => {
  const intl = useIntl();

  return (
    <SelectionGroup
      direction='horizontal'
      className='admin-filter-selector'
      label={intl.formatMessage({ id: 'adminFilterSelectorLabel' })}
    >
      {options.map((filter) => {
        const { list, formattedMessage } = filter;
        return (
          <RadioButton
            key={list}
            id={`filter-${list}`}
            value={list}
            checked={active === list}
            onChange={() => onSelect(list)}
            label={<FormattedMessage id={formattedMessage}>{(txt) => txt}</FormattedMessage>}
          />
        );
      })}
    </SelectionGroup>
  );
};

AdminFilterSelector.propTypes = {
  active: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        list: PropTypes.string,
        formattedMessage: PropTypes.string,
      }),
    ),
  ]),
};

export default AdminFilterSelector;
