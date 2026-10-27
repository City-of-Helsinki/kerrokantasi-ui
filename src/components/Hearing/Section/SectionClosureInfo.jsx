import PropTypes from 'prop-types';

import SanitizedHtml from '../../embed/SanitizedHtml';

const SectionClosureInfoComponent = ({ content }) => (
  <div className='closure-info'>
    <div className='container'>
      <div className='rich-text-content'>
        <SanitizedHtml html={content} />
      </div>
    </div>
  </div>
);

SectionClosureInfoComponent.propTypes = {
  content: PropTypes.string,
};

export default SectionClosureInfoComponent;
