import React from 'react';
import PropTypes from 'prop-types';

import OverviewMap from '../OverviewMap';

const HearingMap = ({hearing, mapContainer}) => {
  return (
    <div className="hearing-map">
      <OverviewMap
        hearings={[hearing]}
        style={{ width: '100%', height: '100%' }}
        hideIfEmpty
        mapContainer={mapContainer}
      />
    </div>
  );
};

HearingMap.propTypes = {
  hearing: PropTypes.object,
  mapContainer: PropTypes.object,
};

export default HearingMap;
