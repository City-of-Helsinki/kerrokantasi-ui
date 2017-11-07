import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HearingsContainer from './views/Hearings';
// import AllHearings from './views/AllHearings';
// import AdminHearings from './views/admin/AdminHearings';
// import HearingManager from './views/admin/HearingManager';
import Hearing from './views/Hearing';
import HomeContainer from './views/Home';
import Info from './views/Info';
import QuestionViewContainer from './views/QuestionView';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomeContainer} />
    <Route path="/hearing/new" component={Hearing} />
    <Route path="/info" component={Info} />
    <Route path="/hearings/:tab" component={HearingsContainer} />
    <Route path="/hearing/:hearingSlug" component={Hearing} />
    <Route path="/hearing/:hearingSlug/:sectionId" component={QuestionViewContainer} />
    <Route exact path="/:hearingSlug" component={Hearing} />
    <Route path="/:hearingSlug/:sectionId" component={QuestionViewContainer} />
  </Switch>
);

export default Routes;
