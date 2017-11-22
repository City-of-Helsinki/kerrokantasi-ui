import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

export class Carousel extends React.Component {

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const {hearing} = this.props;

    return (
      <div>
        <Slider dots {...settings}>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
        </Slider>
      </div>);
  }
}

const SliderItems = ({sections}) => {
  return (
    <div>
      {sections.map((section) => <SliderItem key={Math.random()} section={section} />)}
    </div>
  );
};

const SliderItem = ({section}) => {
  return (
    <div>´WOU SUCH ITEM! {section.title.fi}</div>
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

export default Carousel;
