import {has, isObject, keys} from 'lodash';

/**
 * Tries to get translated value from the given attribute. If there's no value
 * for given language, returns any value. If the given attribute was a string
 * instead of object, the function returns the given string.
 * @param  {(object|string)} attr - Translated field retrieved from API
 * @param  {string} lang - Language code for requested language
 * @return {string} Translated value or empty string.
 */
const getAttr = (attr, lang) => {
  let translated = isObject(attr) && has(attr, lang) ? attr[lang] : attr;
  if (!translated || isObject(translated)) {
    const attrKeys = keys(attr);
    for (let index = 0; index < attrKeys.length; index += 1) {
      translated = attrKeys[index];
      if (translated) {
        break;
      }
    }
  }
  // FIXME return translated || '';
  return translated ? `${translated}-${lang}` : '';
};
export default getAttr;
