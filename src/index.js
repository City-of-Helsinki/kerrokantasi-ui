import 'less/style.less';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';
import store from 'store';
render(<div><Provider store={store}><ReduxRouter/></Provider></div>, document.getElementById('root'));
