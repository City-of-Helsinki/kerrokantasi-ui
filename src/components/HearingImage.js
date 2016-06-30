import React from 'react';

class HearingImage extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <div>
        <img className="img-responsive" title={data.title} alt={data.title} src={data.url}/>
        <div className="image-caption">{data.caption}</div>
      </div>
    );
  }
}

HearingImage.propTypes = {
  data: React.PropTypes.object
};

export default HearingImage;
