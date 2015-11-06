import React from 'react';
import HearingImage from './HearingImage';

class HearingImageList extends React.Component {
  render() {
    const {images} = this.props;
    return (<div>
      {images.map((image) => <HearingImage data={image}/>)}
    </div>);
  }
}

HearingImageList.propTypes = {
  images: React.PropTypes.array
};

export default HearingImageList;
