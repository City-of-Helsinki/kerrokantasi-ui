import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const receiveSectionComments = (state, {payload}) => {
  return updeep({
    [payload.sectionId]: {"state": "done", "data": payload.data}
  }, state);
};

export default handleActions({
  receiveSectionComments
}, {});
