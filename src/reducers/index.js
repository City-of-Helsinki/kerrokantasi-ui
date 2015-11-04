import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import language from './language';
import user from './user';
import hearingLists from './hearingLists';
import hearing from './hearing';
export default combineReducers({router, language, user, hearing, hearingLists});
