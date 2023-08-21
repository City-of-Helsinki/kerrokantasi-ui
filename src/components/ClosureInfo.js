/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

export const ClosureInfo = ({ closureInfo }) => (
  <div className="hearing-section closure-info">
    <div className="section-content">
      <div dangerouslySetInnerHTML={{ __html: closureInfo }} />
    </div>
  </div>
);

ClosureInfo.propTypes = {
  closureInfo: PropTypes.string
};

export default ClosureInfo;
