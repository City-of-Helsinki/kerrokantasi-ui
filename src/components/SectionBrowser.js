import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkWithLang';
import {FormattedMessage} from 'react-intl';

export const SectionBrowserComponent = ({sectionNav, className}) => {
  const random = Math.random();

  return (
    <div
      className={`section-browser ${className}`}
      role="navigation"
      aria-describedby={`section-browser-title-${random}`}
    >
      <div className="section-browser-title" id={`section-browser-title-${random}`} aria-hidden="true">
        <FormattedMessage id="sectionBrowserSubsectionTitle" /> {sectionNav.currentNum}/{sectionNav.totalNum}
      </div>
      <ul className="pager">
        <li className={`previous ${sectionNav.prevPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.prevPath} to={{path: sectionNav.prevPath || '#'}}>
            <span aria-hidden>&larr; </span>&nbsp;
            <FormattedMessage id="previous" />
          </LinkWrapper>
        </li>
        <li className={`next ${sectionNav.nextPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.nextPath} to={{path: sectionNav.nextPath || '#'}}>
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
  sectionNav: PropTypes.object,
  className: PropTypes.string,
};


const LinkWrapper = ({disabled, to, children, ...rest}) => {
  if (disabled) {
    return (
      <span>
        <span className="sr-only">
          <FormattedMessage id="disabledLink" />
        </span>
        {children}
      </span>
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
