import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

export const SectionImageComponent = ({image, altText, caption, title, showLightbox, openLightbox, closeLightbox}) => {
  const defineImageAlt = () => altText || caption || title || '';

  return (
    <figure className="section-image" key={image.url}>
      <img
        className="img-responsive"
        alt={defineImageAlt()}
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
      {caption && <figcaption className="image-caption">{caption}</figcaption>}
    </figure>
  );
};

SectionImageComponent.propTypes = {
  image: PropTypes.object,
  caption: PropTypes.string,
  title: PropTypes.string,
  altText: PropTypes.string,
  showLightbox: PropTypes.bool,
  openLightbox: PropTypes.func,
  closeLightbox: PropTypes.func
};

export default SectionImageComponent;
