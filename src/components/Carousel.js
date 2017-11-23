import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import getAttr from '../utils/getAttr';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import {getSectionURL} from '../utils/section';
import {Link, withRouter} from 'react-router-dom';
import {Row} from 'react-bootstrap';

export class Carousel extends React.Component {

  render() {
    const {hearing, match: params, language} = this.props;

    return (
      <div className="carousel-container">
        <Slider
          infinite={false}
          focusOnSelect
          slidesToShow={4}
          autoplay={false}
          afterChange={(index) => { console.log(index) }}
          initialSlide={params.sectionSlug ? findIndex(hearing.sections, (section) => section.id === params.sectionSlug) : 0}
          ref={slider => {
            this.slider = slider;
          }}
        >
          {hearing.sections.map((section) => <div key={section.id}><SliderItem url={getSectionURL(hearing.slug, section)} language={language} section={section} /></div>)}
        </Slider>
      </div>
    );
  }
}

const SliderItems = ({sections}) => {
  return (
    <div>
      {sections.map((section) => <SliderItem key={Math.random()} section={section} />)}
    </div>
  );
};

const SliderItem = ({section, url, language}) => {
  return (
    <div className="sliderItem">
      <Link to={url}>
        {!isEmpty(section.images) && <img className="sliderImage" src={section.images[0].url} alt="Section"/>}
        <div className="sliderItemContent">
          <div className="sliderItemTitle">{getAttr(section.title, language)}</div>
        </div>
      </Link>
    </div>
  );
};

Carousel.propTypes = {
  hearing: PropTypes.object
};

SliderItems.propTypes = {
  sections: PropTypes.array
};

SliderItem.propTypes = {
  section: PropTypes.object
};

export default withRouter(Carousel);
