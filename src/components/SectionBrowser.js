import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import {FormattedMessage} from 'react-intl';

export const SectionBrowser = ({sectionNav, hearingUrl, isMainSection}) => {
  return (
    <div className="section-browser">
      {!isMainSection ?
        <ul className="pager">
          {!sectionNav.prevPath ? (
            <li className="previous">
              <Link to={hearingUrl + '#start'}>
                <span aria-hidden>&larr; </span>
                <FormattedMessage id="previous" />&nbsp;
              </Link>
            </li>
          ) : (
            <li className="previous">
              <LinkWrapper disabled={!sectionNav.prevPath} to={sectionNav.prevPath + '#start' || '#'}>
                <span aria-hidden>&larr; </span>
                <FormattedMessage id="previous" />&nbsp;
              </LinkWrapper>
            </li>
          )}

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
        :
        <ul className="pager" style={{textAlign: 'center'}}>
          <li className="previous" style={{width: 175, height: 30, display: 'inline-block'}} />

          <li className="pager-counter" style={{fontWeight: 700, lineHeight: 2, color: '#0072c6'}}>
            ({sectionNav.currentNum}/{sectionNav.totalNum})
          </li>
          <li className={`next ${sectionNav.nextPath ? '' : 'disabled'}`}>
            <LinkWrapper disabled={!sectionNav.nextPath} to={sectionNav.nextPath + '#start' || '#'}>
              <FormattedMessage id="next" />&nbsp;
              <span aria-hidden> &rarr;</span>
            </LinkWrapper>
          </li>
        </ul>
      }
    </div>
  );
};

export default SectionBrowser;

SectionBrowser.propTypes = {
  sectionNav: PropTypes.object,
  hearingUrl: PropTypes.string,
  isMainSection: PropTypes.bool
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
