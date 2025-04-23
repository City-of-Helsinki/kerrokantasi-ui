import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, Fieldset } from 'hds-react';

import config from '../../config';

function HearingLanguages({ hearingLanguages, onChange }) {
  const intl = useIntl();

  return (
    <Fieldset className='hearing-languages' heading={<FormattedMessage id='hearingLanguages' />}>
      {config.languages.map((lang) => {
        const langIndex = hearingLanguages.indexOf(lang);
        const checked = langIndex !== -1;
        const onChangeValues = checked
          ? [...hearingLanguages.slice(0, langIndex), ...hearingLanguages.slice(langIndex + 1)]
          : [...hearingLanguages, lang];

        return (
          <Checkbox
            key={`kkEditorLanguageSelector-${lang}`}
            id={`kkEditorLanguageSelector-${lang}`}
            label={intl.formatMessage({ id: `inLanguage-${lang}` })}
            value={lang}
            onChange={() => onChange(onChangeValues)}
            checked={checked}
          />
        );
      })}
    </Fieldset>
  );
}

HearingLanguages.propTypes = {
  hearingLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default injectIntl(HearingLanguages);
