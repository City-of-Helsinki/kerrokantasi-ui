import fiCity from '@city-i18n/fi.json';
import svCity from '@city-i18n/sv.json';
import enCity from '@city-i18n/en.json';

import fi from './fi.json';
import sv from './sv.json';
import en from './en.json';

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved

const languageModules = {
  fi: {...fi, ...fiCity},
  sv: {...sv, ...svCity},
  en: {...en, ...enCity}
};
export default {...languageModules};
