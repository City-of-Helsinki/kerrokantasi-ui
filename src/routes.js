import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HearingsContainer from './views/Hearings';
import HomeContainer from './views/Home';
import Info from './views/Info';
import HearingContainer from './views/Hearing/HearingContainer';
import NewHearingContainer from './views/NewHearing/NewHearingContainer';
import FullscreenHearingContainer from './views/FullscreenHearing/FullscreenHearingContainer';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomeContainer} />
    <Route path="/info" component={Info} />
    <Route path="/hearings/:tab" component={HearingsContainer} />
    <Route path="/hearing/new" component={NewHearingContainer} />
    <Route path="/:hearingSlug/fullscreen" component={FullscreenHearingContainer} />
    <Route path="/:hearingSlug/:sectionId" component={HearingContainer} />
    <Route path="/:hearingSlug" component={HearingContainer} />
  </Switch>
);

export default Routes;
