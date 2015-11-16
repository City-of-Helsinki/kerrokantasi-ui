import React from 'react';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';

export default function getRoot(store) {
  return (<div><Provider store={store}><ReduxRouter/></Provider></div>);
}
