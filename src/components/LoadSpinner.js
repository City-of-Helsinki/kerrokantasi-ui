import React from 'react';
import Icon from '../utils/Icon';

module.exports = function LoadSpinner() {
  return <div className="loader-wrap"><Icon name="hourglass-o" size="2x" spin /></div>;
};
