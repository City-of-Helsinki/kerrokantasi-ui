import React from 'react';
import PropTypes from 'prop-types';
import HearingImage from './HearingImage';

class HearingImageList extends React.Component {
  render() {
    const {images} = this.props;
    return (<div className="hearing-image-list">
      {images.map((image) => <HearingImage data={image} key={image.url}/>)}
    </div>);
  }
}

HearingImageList.propTypes = {
  images: PropTypes.array
};

export default HearingImageList;
