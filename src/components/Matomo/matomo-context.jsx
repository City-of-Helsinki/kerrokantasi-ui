import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const MatomoContext = createContext(null);

export const MatomoProvider = ({ children, value }) => {
  const Context = MatomoContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

MatomoProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.object.isRequired,
};

export default MatomoContext;
