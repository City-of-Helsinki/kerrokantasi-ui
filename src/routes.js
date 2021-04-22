import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoadSpinner from './components/LoadSpinner';
import config from '../src/config';

const HomeContainer = lazy(() => import(
  /* webpackChunkName: "home" */ './views/Home'));
const SilentRenew = lazy(() => import(
  /* webpackChunkName: "home" */ './views/Auth/silentRenew'));
const Info = lazy(() => import(
  /* webpackChunkName: "info" */ './views/Info'));
const AccessibilityInfo = lazy(() => import(
  /* webpackChunkName: "accessibility_info" */ './views/AccessibilityInfo'));
const HearingsContainer = lazy(() => import(
  /* webpackChunkName: "hearings" */'./views/Hearings'));
const HearingContainer = lazy(() => import(
  /* webpackChunkName: "hearing" */'./views/Hearing/HearingContainer'));
const NewHearingContainer = lazy(() => import(
  /* webpackChunkName: "newhearing" */'./views/NewHearing/NewHearingContainer'));
const FullscreenHearingContainer = lazy(() => import(
  /* webpackChunkName: "fullscreen" */'./views/FullscreenHearing/FullscreenHearingContainer'));
const LoginCallback = lazy(() => import(
  /* webpackChunkName: "fullscreen" */'./views/Auth/loginCallback'));
const LogoutCallback = lazy(() => import(
  /* webpackChunkName: "auth" */'./views/Auth/logoutCallback'));
const UserHearings = lazy(() => import(
  /* webpackChunkName: "userHearings" */'./views/UserHearings'));

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
  <Suspense fallback={<LoadSpinner />}>
    <Switch>
      <Route exact path="/" component={HomeContainer} />
      <Route path="/silent-renew" component={SilentRenew} />
      <Route path="/info" component={Info} />
      <Route path="/callback" component={LoginCallback} />
      <Route path="/callback/logout" component={LogoutCallback} />
      <Route path="/user-hearings" component={UserHearings} />
      {config.showAccessibilityInfo && (
        <Route path="/accessibility" component={AccessibilityInfo} />
      )}
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
