import React from 'react';
import PropTypes from 'prop-types';

export const SectionClosureInfo = ({content}) => {
  return (
    <div className="closure-info">
      {content}
    </div>
  );
};

SectionClosureInfo.propTypes = {
  content: PropTypes.string
};

export default SectionClosureInfo;
