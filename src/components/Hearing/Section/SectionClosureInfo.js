import React from 'react';
import PropTypes from 'prop-types';

export const SectionClosureInfoComponent = ({content}) => {
  return (
    <div className="closure-info">
      {content}
    </div>
  );
};

SectionClosureInfoComponent.propTypes = {
  content: PropTypes.string
};

export default SectionClosureInfoComponent;
