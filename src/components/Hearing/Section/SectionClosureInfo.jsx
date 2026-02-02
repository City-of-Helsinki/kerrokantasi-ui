import React from 'react';
import PropTypes from 'prop-types';

import SanitizedHtml from '../../embed/SanitizedHtml';

export const SectionClosureInfoComponent = ({ content }) => (
  <div className='closure-info'>
    <div className='container'>
      <div>
        <SanitizedHtml html={content} />
      </div>
    </div>
  </div>
);

SectionClosureInfoComponent.propTypes = {
  content: PropTypes.string,
};

export default SectionClosureInfoComponent;
