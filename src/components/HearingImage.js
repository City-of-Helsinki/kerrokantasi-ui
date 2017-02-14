import React from 'react';
import getAttr from '../utils/getAttr';

class HearingImage extends React.Component {
  render() {
    const {data} = this.props;
    const {language} = this.context;
    const title = getAttr(data.title, language);
    return (
      <div>
        <img className="img-responsive" title={title} alt={title} src={data.url}/>
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
