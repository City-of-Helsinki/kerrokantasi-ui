/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

const CommentDisclaimer = () => (
  <div className='comment-conditions'>
    <FormattedMessage
      id='commentConditions'
      values={{
        linkToDefinition: (
          <a
            href='https://www.hri.fi/fi/mita-on-avoin-data/'
            target='_blank'
            aria-label={<FormattedMessage id='asOpenData' />}
          >
            <FormattedMessage id='asOpenData' />
          </a>
        ),
        linkToLicense: (
          <a
            href='https://creativecommons.org/licenses/by/4.0/deed.fi'
            target='_blank'
            aria-label={<FormattedMessage id='withOpenLicense' />}
          >
            <FormattedMessage id='withOpenLicense' />
          </a>
        ),
      }}
    />
  </div>
);

export default injectIntl(CommentDisclaimer);
