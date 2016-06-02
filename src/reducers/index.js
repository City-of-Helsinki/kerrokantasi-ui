import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import language from './language';
import user from './user';
import hearingLists from './hearingLists';
import hearing from './hearing';
import sectionComments from './sectionComments';

/**
A reducer that stores the type -- and _only_ the type --
of the last action received.

This is _strictly_ meant to let local-state-containing components
such as CommentForm pseudo-subscribe to actions.
*/
function lastActionType(state = null, action) {
  return (action ? action.type : state);
}

export default combineReducers({
  router, language, user, hearing, hearingLists, sectionComments,
  lastActionType
});
