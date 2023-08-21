/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const IframeEntity = (props) => {
  const { title, src } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <div style={{ overflow: 'hidden' }}>
      <iframe title={title} src={src} />
    </div>
  );
};

IframeEntity.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
};

export default IframeEntity;
