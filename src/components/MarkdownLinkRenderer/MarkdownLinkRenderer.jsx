import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { IconLinkExternal, IconSize } from 'hds-react';

import isExternalLink from '../../utils/isExternalLink';

const MarkdownLinkRenderer = ({ href, children }) => {
  const intl = useIntl();

  return (
    <a
      href={href}
      target='_self'
      rel={undefined}
      {...(isExternalLink(href) && {
        'aria-label': `${intl.formatMessage({ id: 'dataProtection' })} ${intl.formatMessage({
          id: 'linkLeadsToExternal',
        })}`,
      })}
    >
      {children} {isExternalLink(href) && <IconLinkExternal size={IconSize.ExtraSmall} />}
    </a>
  );
};

MarkdownLinkRenderer.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

export default MarkdownLinkRenderer;
