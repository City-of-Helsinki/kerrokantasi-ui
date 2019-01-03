import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';

import config from '../../config';

function HearingLanguages({hearingLanguages, onChange}) {
  return (
    <fieldset className="hearing-languages">
      <legend><FormattedMessage id="hearingLanguages"/></legend>
      <div className="hearing-languages__row">
        {config.languages.map((lang) => {
          const langIndex = hearingLanguages.indexOf(lang);
          const checked = langIndex !== -1;
          const onChangeValues = checked ?
            [...hearingLanguages.slice(0, langIndex), ...hearingLanguages.slice(langIndex + 1)] :
            [...hearingLanguages, lang];

          return (
            <span className="hearing-languages__language" key={lang}>
              <label htmlFor={`kkEditorLanguageSelector-${lang}`}>
                <FormattedMessage id={`inLanguage-${lang}`}/>
                <input
                  id={`kkEditorLanguageSelector-${lang}`}
                  type="checkbox"
                  name="language"
                  value={lang}
                  onChange={() => onChange(onChangeValues)}
                  checked={checked}
                />
              </label>
            </span>
          );
        }
        )}
      </div>
    </fieldset>
  );
}

HearingLanguages.propTypes = {
  hearingLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
};

export default injectIntl(HearingLanguages);
