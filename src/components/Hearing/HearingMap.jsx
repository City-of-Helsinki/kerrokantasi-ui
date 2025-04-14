/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import OverviewMap from '../OverviewMap';

const HearingMap = ({ hearing, ...props }) => (
  <div className='hearing-map'>
    <OverviewMap hearings={[hearing]} style={{ width: '100%', height: '16rem' }} hideIfEmpty {...props} />
  </div>
);

HearingMap.propTypes = {
  hearing: PropTypes.object,
};

export default HearingMap;
