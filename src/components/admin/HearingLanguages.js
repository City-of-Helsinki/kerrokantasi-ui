import React, {PropTypes} from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import {languages} from '../../config';

function HearingLanguages({hearingLanguages, onChange}) {
  return (
    <fieldset className="hearing-languages">
      <legend><FormattedMessage id="hearingLanguages"/></legend>
      <div className="hearing-languages__row">
        {languages.map((lang) => {
          const langIndex = hearingLanguages.indexOf(lang);
          const checked = langIndex !== -1;
          const onChangeValues = checked ?
            [...hearingLanguages.slice(0, langIndex), ...hearingLanguages.slice(langIndex + 1)] :
            [...hearingLanguages, lang];

          return (
            <span className="hearing-languages__language" key={lang}>
              <label htmlFor={`kkEditorLanguageSelector-${lang}`}><FormattedMessage id={`inLanguage-${lang}`}/></label>
              <input
                id={`kkEditorLanguageSelector-${lang}`}
                type="checkbox"
                name="language"
                value={lang}
                onChange={() => onChange(onChangeValues)}
                checked={checked}
              />
            </span>
          );
        }
        )}
      </div>
    </fieldset>
  );
}

HearingLanguages.propTypes = {
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
};

export default injectIntl(HearingLanguages);
