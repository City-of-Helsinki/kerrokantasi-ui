import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import AllHearings from './views/AllHearings';
// import AdminHearings from './views/admin/AdminHearings';
// import HearingManager from './views/admin/HearingManager';

import Async from 'react-code-splitting';

const HomeContainer = () =>
  <Async load={import(/* webpackChunkName: "home" */ './views/Home')} />;
const Hearing = () =>
  <Async load={import(/* webpackChunkName: "hearing" */'./views/Hearing')} />;
const HearingsContainer = () =>
  <Async load={import(/* webpackChunkName: "hearings" */'./views/Hearings')} />;
const Info = () =>
  <Async load={/* webpackChunkName: "info" */import('./views/Info')} />;
const QuestionViewContainer = () =>
  <Async load={import(/* webpackChunkName: "questionview" */'./views/QuestionView')} />;

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
