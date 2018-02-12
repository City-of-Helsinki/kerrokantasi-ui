import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkWithLang';
import {FormattedMessage} from 'react-intl';

export const SectionBrowserComponent = ({sectionNav}) => {
  return (
    <div className="section-browser">
      <ul className="pager">
        <li className={`previous ${sectionNav.prevPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.prevPath} to={{path: sectionNav.prevPath || '#', hash: '#start'}}>
            <span aria-hidden>&larr; </span>
            <FormattedMessage id="previous" />&nbsp;
          </LinkWrapper>
        </li>
        <li className="pager-counter">
          ({sectionNav.currentNum}/{sectionNav.totalNum})
        </li>
        <li className={`next ${sectionNav.nextPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.nextPath} to={{path: sectionNav.nextPath || '#', hash: '#start'}}>
            <FormattedMessage id="next" />&nbsp;
            <span aria-hidden> &rarr;</span>
          </LinkWrapper>
        </li>
      </ul>
    </div>
  );
};

export default SectionBrowserComponent;

SectionBrowserComponent.propTypes = {
  sectionNav: PropTypes.object
};


const LinkWrapper = ({disabled, to, children, ...rest}) => {
  if (disabled) {
    return (
      <a href="" {...rest} onClick={ev => ev.preventDefault()}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

LinkWrapper.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.array,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
};
