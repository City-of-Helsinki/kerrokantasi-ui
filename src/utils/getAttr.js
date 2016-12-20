import {has, isObject, keys} from 'lodash';

const DefaultOptions = {
  exact: false,
  // dev: true
  dev: false
};

/**
 * Tries to get translated value from the given attribute. If there's no value
 * for given language, returns any value. If the given attribute was a string
 * instead of object, the function returns the given string.
 * @param  {(object|string)} attr - Translated field retrieved from API
 * @param  {string} lang - Language code for requested language
 * @param  {object} [options]
 * @return {any} Translated value or unmutated attr if it wasn't object.
 *               Undefined if the exact translation is not available
 *               and option `exact === true`.
 */
const getAttr = (attr, lang, options = DefaultOptions) => {
  const {exact, dev} = options;
  let translated = isObject(attr) && has(attr, lang) ? attr[lang] : attr;

  if (exact && (!isObject(attr) || !translated || isObject(translated))) {
    return undefined;
  }
  if (!translated || isObject(translated)) {
    const attrKeys = keys(attr);
    for (let index = 0; index < attrKeys.length; index += 1) {
      translated = attr[attrKeys[index]];
      if (translated) {
        break;
      }
    }
  }
  if (dev) {
    return `${translated}-${lang}`;
  }
  return translated;
};
export default getAttr;
