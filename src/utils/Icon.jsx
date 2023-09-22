// Vendored version of
// https://github.com/andreypopp/react-fa/blob/fc873dd92fbfb0adfeb6d41210c28658aa5d8ba1/src/Icon.js
// React-FA is copyright 2015, Andrey Popp <8mayday@gmail.com>, licensed under the MIT license

import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
  const {
    Component,
    name,
    size,
    rotate,
    flip,
    spin,
    fixedWidth,
    stack,
    inverse,
    pulse,
    className,
    ...rest
  } = props;

  let classNames = `fa fa-${name}`;
  if (size) {
    classNames = `${classNames} fa-${size}`;
  }
  if (rotate) {
    classNames = `${classNames} fa-rotate-${rotate}`;
  }
  if (flip) {
    classNames = `${classNames} fa-flip-${flip}`;
  }
  if (fixedWidth) {
    classNames = `${classNames} fa-fw`;
  }
  if (spin) {
    classNames = `${classNames} fa-spin`;
  }
  if (pulse) {
    classNames = `${classNames} fa-pulse`;
  }

  if (stack) {
    classNames = `${classNames} fa-stack-${stack}`;
  }
  if (inverse) {
    classNames = `${classNames} fa-inverse`;
  }

  if (className) {
    classNames = `${classNames} ${className}`;
  }
  return <Component {...rest} className={classNames} />;
}



Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
  flip: PropTypes.oneOf(['horizontal', 'vertical']),
  fixedWidth: PropTypes.bool,
  spin: PropTypes.bool,
  pulse: PropTypes.bool,
  stack: PropTypes.oneOf(['1x', '2x']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

Icon.defaultProps = {
  Component: 'span',
};

export default Icon;
