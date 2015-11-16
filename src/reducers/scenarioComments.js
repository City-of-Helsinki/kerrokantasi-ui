const updeep = require('updeep');
import {handleActions} from 'redux-actions';

const receiveScenarioComments = (state, {payload}) => {
  return updeep({
    [payload.scenarioId]: {"state": "done", "data": payload.data}
  }, state);
};

export default handleActions({
  receiveScenarioComments
}, {});
