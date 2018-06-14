import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

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
      {
        showLightbox && <Lightbox
          reactModalProps={{className: "image-lightbox"}}
          mainSrc={image.url}
          onCloseRequest={closeLightbox}
        />
      }
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
