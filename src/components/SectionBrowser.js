import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import {FormattedMessage} from 'react-intl';

export const SectionBrowser = ({sectionNav}) => {
  return (
    <div className="section-browser">
      <ul className="pager">
        <li className={`previous ${sectionNav.prevPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.prevPath} to={sectionNav.prevPath + '#start' || '#'}>
            <span aria-hidden>&larr; </span>
            <FormattedMessage id="previous" />&nbsp;
          </LinkWrapper>
        </li>
        <li className="pager-counter">
          ({sectionNav.currentNum}/{sectionNav.totalNum})
        </li>
        <li className={`next ${sectionNav.nextPath ? '' : 'disabled'}`}>
          <LinkWrapper disabled={!sectionNav.nextPath} to={sectionNav.nextPath + '#start' || '#'}>
            <FormattedMessage id="next" />&nbsp;
            <span aria-hidden> &rarr;</span>
          </LinkWrapper>
        </li>
      </ul>
    </div>
  );
};

export default SectionBrowser;

SectionBrowser.propTypes = {
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
