import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../utils/Icon';

/**
 * Render the loading spinner.
 * @param {{ style: Object }} props - passed properties from HOC
 */
const LoadSpinner = (props) => (
  <div className="loader-wrap" style={{ ...props.style }}>
    <Icon name="hourglass-o" size="2x" spin />
  </div>
);

LoadSpinner.propTypes = {
  style: PropTypes.object,
};

export default LoadSpinner;

