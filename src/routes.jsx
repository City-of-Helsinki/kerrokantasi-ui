/* eslint-disable react/forbid-prop-types */
import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';

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
const Redirector = () => {
  const { hearingSlug } = useParams();
  return (
  <div>
    <Navigate to={`/${hearingSlug}`} />
  </div>
)};

const AppRoutes = () => (
  <Suspense fallback={<LoadSpinner />}>
    <Routes>
      <Route exact path="/" Component={props => <HomeContainer {...props} />} />
      <Route path="/silent-renew" Component={props => <SilentRenew {...props} />} />
      <Route path="/info" Component={props => <Info {...props} />} />
      {config.enableCookies && (
        <Route path="/cookies" Component={props => <CookieManagement {...props} />} />
      )}
      <Route path="/callback" Component={props => <LoginCallback {...props} />} />
      <Route path="/callback/logout" Component={props => <LogoutCallback {...props} />} />
      <Route path="/user-hearings" Component={props => <UserHearings {...props} />} />
      <Route path="/user-profile" Component={props => <UserProfile {...props} />} />
      {config.showAccessibilityInfo && (
        <Route path="/accessibility" Component={props => <AccessibilityInfo {...props} />} />
      )}
      <Route path="/hearings/:tab" Component={props => <HearingsContainer {...props} />} />
      <Route path="/hearing/new" Component={props => <NewHearingContainer {...props} />} />
      <Route path="/hearing/:hearingSlug" Component={props => <Redirector {...props} />} />
      <Route path="/:hearingSlug/fullscreen" Component={props => <FullscreenHearingContainer {...props} />} />
      <Route path="/:hearingSlug/*" Component={props => <HearingContainer {...props} />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
