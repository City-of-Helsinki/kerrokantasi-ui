import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock } from 'draft-js';
const ImageCaptionEntity = (props) => {
  //const {src} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <EditorBlock {...props} />
  );
};

ImageCaptionEntity.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string
};

export default ImageCaptionEntity;
