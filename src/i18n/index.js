import fi from './fi.json';
import sv from './sv.json';
import en from './en.json';

// eslint-disable-next-line import/no-unresolved
import fiCity from '@city-i18n/fi.json';
// eslint-disable-next-line import/no-unresolved
import svCity from '@city-i18n/sv.json';
// eslint-disable-next-line import/no-unresolved
import enCity from '@city-i18n/en.json';

const languageModules = {
  fi: {...fi, ...fiCity},
  sv: {...sv, ...svCity},
  en: {...en, ...enCity}
};
export default {...languageModules};
