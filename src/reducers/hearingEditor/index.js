import {combineReducers} from 'redux';
import hearing from './hearing';
// import labels from './label';
// import contactPersons from './contactPerson';
import sections from './sections';

export default combineReducers({
  hearing,
  sections,
});
