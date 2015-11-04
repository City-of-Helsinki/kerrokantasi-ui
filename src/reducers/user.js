import {handleActions} from 'redux-actions';

const login = (/* state, action */) => ({
  id: 'cmljayBhc3RsZXk=',
  name: 'Mock von User'
});

const logout = (/* state, action */) => {
  return null;
};

export default handleActions({login, logout}, null);
