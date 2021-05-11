import React from 'react';
import PropTypes from 'prop-types';

const ImageEntity = (props) => {
  const {src} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <div style={{overflow: "hidden"}}>
      <img src={src} />
    </div>
  );
};

ImageEntity.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string
};

export default ImageEntity;
