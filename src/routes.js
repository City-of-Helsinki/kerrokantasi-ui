import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import LoadSpinner from './components/LoadSpinner';
import config from "./config";

const HomeContainer = lazy(() => import(
  /* webpackChunkName: "home" */ './views/Home'));
const SilentRenew = lazy(() => import(
  /* webpackChunkName: "home" */ './views/Auth/silentRenew'));
const Info = lazy(() => import(
  /* webpackChunkName: "info" */ './views/Info'));
const CookieManagement = lazy(() => import(
  /* webpackChunkName: "cookie_management" */ './views/CookieManagement'));
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
const UserProfile = lazy(() => import(
  /* webpackChunkName: "userProfile" */'./views/UserProfile'));


/* Vanilla Redirect component can't handle dynamic rerouting,
 * so we need Redirector to access params for the hearingSlug
 */
const Redirector = ({match}) => (
    <div>
      <Redirect to={{path: `/${  match.params.hearingSlug}`}} />
    </div>
  );

Redirector.propTypes = {
  match: PropTypes.object
};

const Routes = () => (
  <Suspense fallback={<LoadSpinner />}>
    <Switch>
      <Route exact path="/" component={props => <HomeContainer {...props} />} />
      <Route path="/silent-renew" component={props => <SilentRenew {...props}/>} />
      <Route path="/info" component={props => <Info {...props}/>} />
      {config.enableCookies && (
        <Route path="/cookies" component={props => <CookieManagement {...props} />} />
      )}
      <Route path="/callback" component={props => <LoginCallback {...props} />} />
      <Route path="/callback/logout" component={props => <LogoutCallback {...props} />} />
      <Route path="/user-hearings" component={props => <UserHearings {...props} />} />
      <Route path="/user-profile" component={props => <UserProfile {...props} />} />
      {config.showAccessibilityInfo && (
        <Route path="/accessibility" component={props => <AccessibilityInfo {...props} />} />
      )}
      <Route path="/hearings/:tab" component={props => <HearingsContainer {...props} />} />
      <Route path="/hearing/new" component={props => <NewHearingContainer {...props} />} />
      <Route path="/hearing/:hearingSlug" component={props => <Redirector {...props} />} />
      <Route path="/:hearingSlug/fullscreen" component={props => <FullscreenHearingContainer {...props} />} />
      <Route path="/:hearingSlug/:sectionId" component={props => <HearingContainer {...props} />} />
      <Route path="/:hearingSlug" component={props => <HearingContainer {...props} />} />
    </Switch>
  </Suspense>
);

export default Routes;
