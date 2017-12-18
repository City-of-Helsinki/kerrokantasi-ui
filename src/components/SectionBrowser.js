import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import getAttr from '../utils/getAttr';
import {FormattedMessage} from 'react-intl';

export const SectionBrowser = ({sectionNav, section, language, hearingUrl, isMainSection}) => {
  return (
    <div className="section-browser">
      {!isMainSection ?
        <ul className="pager">
          {!sectionNav.prevPath ? (
            <li className="previous">
              <Link to={hearingUrl}>
                <FormattedMessage id="hearing" />
              </Link>
            </li>
          ) : (
            <li className="previous">
              <LinkWrapper disabled={!sectionNav.prevPath} to={sectionNav.prevPath || '#'}>
                <span aria-hidden>&larr; </span>
                <FormattedMessage id="previous" />&nbsp;
                <span className="type-name hidden-xs">
                  {getAttr(sectionNav.prevType || section.type_name_singular, language)}
                </span>
              </LinkWrapper>
            </li>
          )}

          <li className="pager-counter">
            ({sectionNav.currentNum}/{sectionNav.totalNum})
          </li>
          <li className={`next ${sectionNav.nextPath ? '' : 'disabled'}`}>
            <LinkWrapper disabled={!sectionNav.nextPath} to={sectionNav.nextPath || '#'}>
              <FormattedMessage id="next" />&nbsp;
              <span className="type-name hidden-xs">
                {getAttr(sectionNav.nextType || section.type_name_singular, language)}
              </span>
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
            <LinkWrapper disabled={!sectionNav.nextPath} to={sectionNav.nextPath || '#'}>
              <FormattedMessage id="next" />&nbsp;
              <span className="type-name hidden-xs">
                {getAttr(sectionNav.nextType || section.type_name_singular, language)}
              </span>
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
  section: PropTypes.object,
  language: PropTypes.string,
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
