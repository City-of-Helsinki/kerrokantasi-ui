import {keys, isObject} from 'lodash';

/**
 * Tries to get translated value from the given attribute. If there's no value
 * for given language, returns any value. If the given attribute was a string
 * instead of object, the function returns the given string.
 * @param  {(object|string)} attr - Translated field retrieved from API
 * @param  {string} lang - Language code for requested language
 * @return {(string|null)} Translated value.
 */
const getAttr = (attr, lang) => {
  let translated = isObject(attr) && attr[lang] ? attr[lang] : attr;
  if (!translated) {
    for (let index = 0; index < keys(attr).length; index += 1) {
      translated = attr[keys(attr)[index]];
      if (translated) {
        break;
      }
    }
  }
  return translated || null;
};

export default getAttr;