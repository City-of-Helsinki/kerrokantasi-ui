/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../utils/Icon';

/**
 * Render the loading spinner.
 * @param {{ style: Object }} props - passed properties from HOC
 */
const LoadSpinner = (props) => (
  <div data-testid="load-spinner" className='loader-wrap' style={{ ...props.style }}>
    <Icon name='hourglass-o' size='2x' spin />
  </div>
);

LoadSpinner.propTypes = {
  style: PropTypes.object,
};

export default LoadSpinner;
