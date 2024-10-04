import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Icon from '../../../utils/Icon';
import config from '../../../config';
import getAttr from '../../../utils/getAttr';

const HearingTranslationNotice = ({ title }) => {
  const availableInLanguageMessages = {
    fi: 'Kuuleminen saatavilla suomeksi',
    sv: 'Hörandet tillgängligt på svenska',
    en: 'Questionnaire available in English',
  };

  return (
    <div className='hearing-card-notice'>
      <Icon name='exclamation-circle' aria-hidden='true' />
      <FormattedMessage id='hearingTranslationNotAvailable' />
      {config.languages.map((lang) =>
        getAttr(title, lang, { exact: true }) ? (
          <div className='language-available-message' key={lang} lang={lang}>
            {availableInLanguageMessages[lang]}
          </div>
        ) : null,
      )}
    </div>
  );
};

HearingTranslationNotice.propTypes = {
  title: PropTypes.string,
};

export default HearingTranslationNotice;
