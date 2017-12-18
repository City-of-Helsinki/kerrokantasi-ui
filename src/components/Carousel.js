import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import getAttr from '../utils/getAttr';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import {getSectionURL} from '../utils/section';
import {Link, withRouter} from 'react-router-dom';
import OverviewMap from './OverviewMap';

export class SectionCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slideCount: this.getSlideCount()
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({slideCount: this.getSlideCount()});
  }

  getSlideCount = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 400) {
      return 1;
    }

    if (typeof window !== 'undefined' && window.innerWidth < 500) {
      return 2;
    }

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 3;
    }

    return 4;
  }

  render() {
    const {hearing, match: {params}, language} = this.props;
    const {slideCount} = this.state;
    const sectionsWithoutClosure = hearing.sections.filter((section) => section.type !== 'CLOSURE');

    return (
        <div className="slider-container">
          <Slider
            className="slider"
            ref={slider => {
              this.slider = slider;
            }}
            infinite={false}
            focusOnSelect
            slidesToShow={slideCount}
            autoplay={false}
            centerMode={true}
            centerPadding= '50px'
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
            initialSlide={params.sectionId ? findIndex(sectionsWithoutClosure, (section) => section.id === params.sectionId) : 0}
          >
            <div>
              <div className="slider-item">
                  {hearing.geojson && <HearingMap hearing={hearing} />}
              </div>
            </div>
            {sectionsWithoutClosure.map(
              (section) => <div key={section.id}><SliderItem hearingTitle={hearing.title} url={section.type === 'main' ? `/${hearing.slug}` : getSectionURL(hearing.slug, section)} language={language} section={section} /></div>)}
          </Slider>
        </div>
    );
  }
}

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

const SliderItem = ({section, url, language, hearingTitle}) => {
  let cardImageStyle = {
    backgroundImage: 'url(/assets/images/default-image.svg)',
  };
  if (!isEmpty(section.images)) {
    cardImageStyle = {
      backgroundImage: 'url("' + section.images[0].url + '")',
    };
  }
  return (
    <div className="slider-item">
      <Link to={url}>
        <div className="slider-image" style={cardImageStyle}></div>
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
  hearingTitle: PropTypes.object
};
