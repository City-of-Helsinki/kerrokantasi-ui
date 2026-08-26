import React from 'react';
import PropTypes from 'prop-types';

const ImageEntity = (props) => {
  const { src } = props.contentState.getEntity(props.entityKey).getData();
  return <img src={src} alt='' />;
};

ImageEntity.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
};

export default ImageEntity;
