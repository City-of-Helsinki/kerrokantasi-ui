import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'App';
import Hearing from 'views/Hearing';
import Home from 'views/Home';
import Info from 'views/Info';
import NotFound from 'views/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/info" component={Info} />
    <Route path="/hearing_(:hearingId)" component={Hearing} />
    <Route path="*" component={NotFound} />
  </Route>
);
