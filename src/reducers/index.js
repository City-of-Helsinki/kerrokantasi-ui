import {combineReducers} from 'redux';
import language from './language';
import user from './user';
import hearingLists from './hearingLists';
import hearing from './hearing';
import sectionComments from './sectionComments';
import labels from './labels';
import hearingEditor from './hearingEditor';
import headless from './headless';
import {routerReducer} from 'react-router-redux';
import projectLists from './projectLists';
import { reducer as oidc } from "redux-oidc";
import apitoken from "./api";
import accessibility from "./accessibility";

/**
A reducer that stores the type -- and _only_ the type --
of the last action received.

This is _strictly_ meant to let local-state-containing components
such as CommentForm pseudo-subscribe to actions.
*/
function lastActionType(state = null, action) {
  return action ? action.type : state;
}

export default combineReducers({
  hearing,
  hearingEditor,
  hearingLists,
  projectLists,
  language,
  accessibility,
  headless,
  oidc,
  apitoken,
  lastActionType,
  sectionComments,
  user,
  labels,
  router: routerReducer
});
