import React from 'react';
import PropTypes from 'prop-types';

import { SanitizedHtml } from './embed';

export const ClosureInfo = ({ closureInfo }) => {
  return (
    <div className='hearing-section closure-info'>
      <div className='section-content'>
        <SanitizedHtml html={closureInfo} />
      </div>
    </div>
  );
};

ClosureInfo.propTypes = {
  closureInfo: PropTypes.string,
};

export default ClosureInfo;
