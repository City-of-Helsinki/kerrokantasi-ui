/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'yet-another-react-lightbox';

const SectionImageComponent = ({ image, altText, caption, title }) => {
  const [open, setOpen] = useState(false);

  if (!image) return null;

  const alt = altText || caption || title || '';

  const openLightbox = () => {
    document.body.classList.remove('nav-fixed');
    setOpen(true);
  };

  const closeLightbox = () => {
    document.body.classList.add('nav-fixed');
    setOpen(false);
  };

  return (
    <figure className='section-image' key={image.url}>
      <img
        className='img-responsive'
        alt={alt}
        src={image.url}
        onClick={openLightbox}
        onKeyPress={openLightbox}
      />
      {caption && <figcaption className='image-caption'>{caption}</figcaption>}
      <Lightbox
        open={open}
        close={closeLightbox}
        slides={[{ src: image.url, alt }]}
        className='image-lightbox'
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
      />
    </figure>
  );
};

SectionImageComponent.propTypes = {
  image: PropTypes.object,
  caption: PropTypes.string,
  title: PropTypes.string,
  altText: PropTypes.string,
};

export default SectionImageComponent;
