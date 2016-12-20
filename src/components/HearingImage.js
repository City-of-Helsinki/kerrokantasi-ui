import React from 'react';
import getAttr from '../utils/getAttr';

class HearingImage extends React.Component {
  render() {
    const {data} = this.props;
    const {language} = this.context;
    return (
      <div>
        <img className="img-responsive" title={getAttr(data.title, language)} alt={getAttr(data.title, language)} src={data.url}/>
        <div className="image-caption">{getAttr(data.caption, language)}</div>
      </div>
    );
  }
}

HearingImage.propTypes = {
  data: React.PropTypes.object
};

HearingImage.contextTypes = {
  language: React.PropTypes.string
};

export default HearingImage;
