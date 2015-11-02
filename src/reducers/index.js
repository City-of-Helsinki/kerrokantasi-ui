import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import language from './language';
export default combineReducers({router, language});
