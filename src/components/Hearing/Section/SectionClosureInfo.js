/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

export const SectionClosureInfoComponent = ({content}) => {
  return (
    <div className="closure-info">
      <div className="container">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

SectionClosureInfoComponent.propTypes = {
  content: PropTypes.string
};

export default SectionClosureInfoComponent;
