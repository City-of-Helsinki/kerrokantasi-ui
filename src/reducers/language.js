import config from '../config';

export default function language(state, action) {
  if (action.type === 'setLanguage') {
    if (config.languages.indexOf(action.payload) > -1) {
      config.activeLanguage = action.payload; // for non react-intl localizations
      return action.payload;
    }
  }
  return state || config.languages[0];
}
