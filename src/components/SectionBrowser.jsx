import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Link from './LinkWithLang';

export const SectionBrowserComponent = ({ sectionNav }) => (
  <div className='section-browser' role='navigation' aria-labelledby='section-browser-title'>
    <ul className='pager'>
      <li className={`previous ${sectionNav.prev.path ? '' : 'disabled'}`}>
        <LinkWrapper disabled={!sectionNav.prev.path} to={sectionNav.prev}>
          <span aria-hidden>&larr; </span>&nbsp;
          <FormattedMessage id='previous' />
        </LinkWrapper>
      </li>
      <li role='presentation' className='section-browser-title' id='section-browser-title' aria-hidden='true'>
        <FormattedMessage id='subsectionTitle' /> {sectionNav.currentNum}/{sectionNav.totalNum}
      </li>
      <li className={`next ${sectionNav.next.path ? '' : 'disabled'}`}>
        <LinkWrapper disabled={!sectionNav.next.path} to={sectionNav.next}>
          <FormattedMessage id='next' />
          &nbsp;
          <span aria-hidden> &rarr;</span>
        </LinkWrapper>
      </li>
    </ul>
  </div>
);

export default SectionBrowserComponent;

SectionBrowserComponent.propTypes = {
  sectionNav: PropTypes.object,
};

const LinkWrapper = ({ disabled, to, children, ...rest }) => {
  if (disabled) {
    return (
      <span>
        <span className='sr-only'>
          <FormattedMessage id='disabledLink' />
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
