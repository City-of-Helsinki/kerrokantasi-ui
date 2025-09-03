import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { IconLinkExternal, IconSize } from 'hds-react';

const CommentDisclaimer = () => {
  const intl = useIntl();

  return (
    <div className='comment-conditions'>
      <FormattedMessage
        id='commentConditions'
        values={{
          linkToDefinition: (
            <a
              href='https://www.hri.fi/fi/mita-on-avoin-data/'
              aria-label={`${intl.formatMessage({ id: 'asOpenData' })} ${intl.formatMessage({
                id: 'linkLeadsToExternal',
              })}`}
            >
              <FormattedMessage id='asOpenData' /> <IconLinkExternal size={IconSize.Small} />
            </a>
          ),
          linkToLicense: (
            <a
              href='https://creativecommons.org/licenses/by/4.0/deed.fi'
              aria-label={`${intl.formatMessage({ id: 'withOpenLicense' })} ${intl.formatMessage({
                id: 'linkLeadsToExternal',
              })}`}
            >
              <FormattedMessage id='withOpenLicense' /> <IconLinkExternal size={IconSize.Small} />
            </a>
          ),
        }}
      />
    </div>
  );
};

export default CommentDisclaimer;
