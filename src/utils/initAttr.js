import {languages} from '../config';

const INIT_ATTR = languages.reduce((attr, lang) => {
  const temp = Object.assign({}, attr);
  temp[lang] = '';
  return temp;
}, {});

const initAttr = () =>
  Object.assign({}, INIT_ATTR);

export default initAttr;
