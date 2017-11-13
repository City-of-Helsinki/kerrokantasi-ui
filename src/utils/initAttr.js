import config from '../config';

const INIT_ATTR = config.languages.reduce((attr, lang) => {
  const temp = Object.assign({}, attr);
  temp[lang] = '';
  return temp;
}, {});

const initAttr = () =>
  Object.assign({}, INIT_ATTR);

export default initAttr;
