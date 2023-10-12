/* eslint-disable react/forbid-prop-types */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import getAttr from '../utils/getAttr';

const HearingImage = (props) => {
  const { data } = props;

  const context = useContext();

  const { language } = context;
  const title = getAttr(data.title, language);
  return (
    <figure>
      <img className='img-responsive center' style={{ margin: '0 auto' }} title={title} alt={title} src={data.url} />
      <figcaption className='image-caption'>{getAttr(data.caption, language)}</figcaption>
    </figure>
  );
};

HearingImage.propTypes = {
  data: PropTypes.object,
};

HearingImage.contextTypes = {
  language: PropTypes.string,
};

export default HearingImage;
