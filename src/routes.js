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
import NewHearingContainer from './views/NewHearing/HearingContainer';
import FullscreenHearingContainer from './views/FullscreenHearing/FullscreenHearingContainer';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomeContainer} />
    <Route path="/hearing/new" component={Hearing} />
    <Route path="/info" component={Info} />
    <Route path="/hearingold/:hearingSlug" component={Hearing} />
    <Route path="/hearings/:tab" component={HearingsContainer} />
    <Route path="hearing/:hearingSlug" component={NewHearingContainer} />
    <Route path="/hearingold/:hearingSlug/:sectionId" component={QuestionViewContainer} />
    <Route path="/:hearingSlug/fullscreen" component={FullscreenHearingContainer} />
    <Route path="/:hearingSlug/:sectionId" component={NewHearingContainer} />
    <Route path="/:hearingSlug" component={NewHearingContainer} />
  </Switch>
);

export default Routes;
