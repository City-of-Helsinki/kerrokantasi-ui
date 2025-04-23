import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock } from 'draft-js';

const ImageCaptionEntity = (props) => <EditorBlock {...props} />;

ImageCaptionEntity.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
};

export default ImageCaptionEntity;
