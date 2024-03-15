import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import language from './language';
import user from './user';
import hearingLists from './hearingLists';
import hearing from './hearing';
import sectionComments from './sectionComments';
import labels from './labels';
import hearingEditor from './hearingEditor';
import headless from './headless';
import oidc from './oidc';
import projectLists from './projectLists';
import accessibility from "./accessibility";

/**
A reducer that stores the type -- and _only_ the type --
of the last action received.

This is _strictly_ meant to let local-state-containing components
such as CommentForm pseudo-subscribe to actions.
*/
// eslint-disable-next-line default-param-last
function lastActionType(state = null, action) {
  return action ? action.type : state;
}

export default combineReducers({
  hearing,
  hearingEditor,
  hearingLists,
  oidc,
  projectLists,
  language,
  accessibility,
  headless,
  lastActionType,
  sectionComments,
  user,
  labels,
  router: routerReducer
});
