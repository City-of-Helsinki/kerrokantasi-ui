import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import getAttr from '../utils/getAttr';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import {getSectionURL} from '../utils/section';
import {withRouter} from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import OverviewMap from './OverviewMap';

export const SectionCarousel = ({hearing, match: {params}, language}) => {
  const sectionsWithoutClosure = hearing.sections.filter((section) => section.type !== 'closure-info');
  const slides = sectionsWithoutClosure.map(
    (section) =>
      <div key={section.id}>
        <SliderItem
          active={(params.sectionId && section.id === params.sectionId.split('#')[0]) || (!params.sectionId && section.type === 'main')}
          hearingTitle={hearing.title}
          url={section.type === 'main' ? `/${hearing.slug}#start` : getSectionURL(hearing.slug, section) + '#start'}
          language={language}
          section={section}
        />
      </div>);
  if (hearing.geojson) {
    slides.unshift(<div key="map">
      <div className="slider-item">
        <HearingMap hearing={hearing} />
      </div>
    </div>);
  }

  return (
    <div className="carousel-container">
      <div id="start" />
      <div className="slider-container">
        <Slider
          className="slider"
          ref={slider => {
            this.slider = slider;
          }}
          initialSlide={params.sectionId ? findIndex(sectionsWithoutClosure, (section) => section.id === params.sectionId.split('#')[0]) + 1 : 1}
          infinite={false}
          focusOnSelect
          autoplay={false}
          centerMode
          centerPadding="50px"
          responsive={[{
            breakpoint: 768,
            settings: { slidesToShow: 1 }
          },
          {
            breakpoint: 1200,
            settings: { slidesToShow: 3 }
          },
          {
            breakpoint: 100000,
            settings: { slidesToShow: 5 }
          }]}
        >
          {slides}
        </Slider>
      </div>
    </div>
  );
};

SectionCarousel.propTypes = {
  hearing: PropTypes.object,
  match: PropTypes.object,
  language: PropTypes.string
};

export default withRouter(SectionCarousel);

const HearingMap = ({hearing}) => {
  return (
    <div className="carousel-map-container">
      <div className="carousel-map">
        <OverviewMap hearings={[hearing]} style={{width: '100%', height: '100%'}} hideIfEmpty />
      </div>
    </div>
  );
};

HearingMap.propTypes = {
  hearing: PropTypes.object
};

const SliderItem = ({section, url, language, hearingTitle, active}) => {
  const cardImageStyle = {
    backgroundImage: !isEmpty(section.images) ? 'url("' + section.images[0].url + '")' : 'url(/assets/images/default-image.svg)'
  };

  return (
    <div className={active ? "slider-item-current" : "slider-item"}>
      <Link to={url}>
        <div className="slider-image" style={cardImageStyle} />
        <div className="slider-item-content">
          <div className="slider-item-title">{section.type === 'main' ? getAttr(hearingTitle, language) : getAttr(section.title, language)}</div>
        </div>
      </Link>
    </div>
  );
};


SliderItem.propTypes = {
  section: PropTypes.object,
  url: PropTypes.string,
  language: PropTypes.string,
  hearingTitle: PropTypes.object,
  active: PropTypes.bool
};
