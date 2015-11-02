import {languages} from 'config';

export default function language(state, action) {
  if (action.type === 'setLanguage') {
    if (languages.indexOf(action.payload) > -1) {
      return action.payload;
    }
  }
  return state || languages[0];
}
