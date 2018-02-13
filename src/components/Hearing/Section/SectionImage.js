import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';

export const SectionImageComponent = ({image, caption, title, showLightbox, openLightbox, closeLightbox}) => {
  return (
    <div className="section-image" key={image.url}>
      <img
        className="img-responsive"
        alt={title}
        title={title}
        src={image.url}
        onClick={openLightbox}
        onKeyPress={openLightbox}
      />
      <Lightbox
        images={[{ src: image.url }]}
        isOpen={showLightbox}
        onClose={closeLightbox}
      />
      <div className="image-caption">{caption}</div>
    </div>
  );
};

SectionImageComponent.propTypes = {
  image: PropTypes.object,
  caption: PropTypes.string,
  title: PropTypes.string,
  showLightbox: PropTypes.bool,
  openLightbox: PropTypes.func,
  closeLightbox: PropTypes.func
};

export default SectionImageComponent;
