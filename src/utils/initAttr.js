import config from '../config';

const INIT_ATTR = config.languages.reduce((attr, lang) => {
  const temp = { ...attr };
  temp[lang] = '';
  return temp;
}, {});

const initAttr = () =>
  ({ ...INIT_ATTR });

export default initAttr;
