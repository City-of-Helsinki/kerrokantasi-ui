import languages from '../i18n';
import config from '../config';

/**
 * Obtain translations for UI message strings outside react-intl.
 * @param  {string} string - The identifier for the string to be localized
 * @param  {string} lang - Language code for requested language
 */

const getMessage = (string, lang = config.activeLanguage) => {
  if (languages[lang] && languages[lang][string]) return languages[lang][string];
  // if translation wasn't found, return any other translation
  for (let index = 0; index < config.languages.length; index += 1) {
    const map = languages[config.languages[index]];
    if (map && map[string]) return map[string];
  }
  // just return the name of the string if it hasn't been translated yet
  return string;
};

export default getMessage;
