/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Checkbox, Fieldset } from 'hds-react';

import config from '../../config';

function HearingLanguages({ hearingLanguages, onChange }) {
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
            label={<FormattedMessage id={`inLanguage-${lang}`} />}
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
