import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import OverviewMap from '../OverviewMap';

const HearingMap = ({ hearing, ...props }) => {
  // Keep a stable array reference so OverviewMap only rebuilds its layers
  // when the hearing itself changes, not on every parent re-render.
  const hearings = useMemo(() => [hearing], [hearing]);

  return (
    <div className='hearing-map'>
      <OverviewMap
        hearings={hearings}
        style={{ width: '100%', height: '16rem' }}
        hideIfEmpty
        {...props}
      />
    </div>
  );
};

HearingMap.propTypes = {
  hearing: PropTypes.object,
};

export default HearingMap;
