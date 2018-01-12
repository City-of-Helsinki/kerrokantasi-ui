import React from 'react';
import PropTypes from 'prop-types';

export const SectionImage = ({image, caption, title}) => {
  return (
    <div key={image.url}>
      <img
        className="img-responsive"
        alt={title}
        title={title}
        src={image.url}
      />
      <div className="image-caption">{caption}</div>
    </div>
  );
};

SectionImage.propTypes = {
  image: PropTypes.object,
  caption: PropTypes.string,
  title: PropTypes.string
};

export default SectionImage;
