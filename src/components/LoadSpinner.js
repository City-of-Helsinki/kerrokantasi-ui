import React from 'react';
import Icon from '../utils/Icon';

module.exports = function LoadSpinner() {
  return <div className="loader-wrap"><Icon name="spinner" size="2x" spin className="text-primary" /></div>;
};
