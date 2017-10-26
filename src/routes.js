import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Hearings from './views/Hearings';
// import AllHearings from './views/AllHearings';
// import AdminHearings from './views/admin/AdminHearings';
// import HearingManager from './views/admin/HearingManager';
import Hearing from './views/Hearing';
import Home from './views/Home';
import Info from './views/Info';
import QuestionView from './views/QuestionView';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/hearing/new" component={Hearing} />
    <Route path="/info" component={Info} />
    <Route path="/hearings/:tab" component={Hearings} />
    <Route path="/hearing/:hearingSlug" component={Hearing} />
    <Route path="/hearing/:hearingSlug/:sectionId" component={QuestionView} />
    <Route exact path="/:hearingSlug" component={Hearing} />
    <Route path="/:hearingSlug/:sectionId" component={QuestionView} />
  </Switch>
);

export default Routes;
