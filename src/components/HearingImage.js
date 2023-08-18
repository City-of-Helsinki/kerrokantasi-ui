import React from 'react';
import PropTypes from 'prop-types';

import getAttr from '../utils/getAttr';

class HearingImage extends React.Component {
  render() {
    const {data} = this.props;
    const {language} = this.context;
    const title = getAttr(data.title, language);
    return (
      <figure>
        <img className="img-responsive center" style={{margin: '0 auto'}} title={title} alt={title} src={data.url}/>
        <figcaption className="image-caption">{getAttr(data.caption, language)}</figcaption>
      </figure>
    );
  }
}

HearingImage.propTypes = {
  data: PropTypes.object
};

HearingImage.contextTypes = {
  language: PropTypes.string
};

export default HearingImage;
