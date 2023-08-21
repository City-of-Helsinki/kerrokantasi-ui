/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const ImageEntity = (props) => {
  const { src } = props.contentState.getEntity(props.entityKey).getData();
  return (
    // eslint-disable-next-line
    <img src={src} />
  );
};

ImageEntity.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string
};

export default ImageEntity;
