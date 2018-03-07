import {handleActions} from 'redux-actions';
import mockProjects from './mock-projects';

const projects = (state) => {
  return state || mockProjects;
};

export default projects;
