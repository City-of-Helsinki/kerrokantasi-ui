import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

const HomeContainer = lazy(() => import('./views/Home'));
const Info = lazy(() => import('./views/Info'));
const HearingsContainer = lazy(() => import('./views/Hearings'));
const HearingContainer = lazy(() => import('./views/Hearing/HearingContainer'));
const NewHearingContainer = lazy(() => import('./views/NewHearing/NewHearingContainer'));
const FullscreenHearingContainer = lazy(() => import('./views/FullscreenHearing/FullscreenHearingContainer'));

/* Vanilla Redirect component can't handle dynamic rerouting,
 * so we need Redirector to access params for the hearingSlug
 */
const Redirector = ({match}) => {
  return (
    <div>
      <Redirect to={{path: '/' + match.params.hearingSlug}} />
    </div>
  );
};

Redirector.propTypes = {
  match: PropTypes.object
};

const Routes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Switch>
      <Route exact path="/" component={HomeContainer} />
      <Route path="/info" component={Info} />
      <Route path="/hearings/:tab" component={HearingsContainer} />
      <Route path="/hearing/new" component={NewHearingContainer} />
      <Route path="/hearing/:hearingSlug" component={Redirector} />
      <Route path="/:hearingSlug/fullscreen" component={FullscreenHearingContainer} />
      <Route path="/:hearingSlug/:sectionId" component={HearingContainer} />
      <Route path="/:hearingSlug" component={HearingContainer} />
    </Switch>
  </Suspense>
);

export default Routes;
