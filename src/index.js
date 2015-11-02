import 'assets/app.less';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';
import store from 'store';

import {addLocaleData} from 'react-intl';
import en from 'react-intl/lib/locale-data/en';
import fi from 'react-intl/lib/locale-data/fi';
import sv from 'react-intl/lib/locale-data/sv';
addLocaleData(en);
addLocaleData(fi);
addLocaleData(sv);

render(<div><Provider store={store}><ReduxRouter/></Provider></div>, document.getElementById('root'));
