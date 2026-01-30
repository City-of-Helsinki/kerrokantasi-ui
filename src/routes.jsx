import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';

import LoadSpinner from './components/LoadSpinner';
import config from './config';

const HomeContainer = lazy(() => import('./views/Home'));
const SilentRenew = lazy(() => import('./views/Auth/silentRenew'));
const Info = lazy(() => import('./views/Info'));
const CookieManagement = lazy(() => import('./views/CookieManagement'));
const AccessibilityInfo = lazy(() => import('./views/AccessibilityInfo'));
const HearingsContainer = lazy(() => import('./views/Hearings'));
const HearingContainer = lazy(() => import('./views/Hearing/HearingContainer'));
const NewHearingContainer = lazy(() => import('./views/NewHearing/NewHearingContainer'));
const FullscreenHearingContainer = lazy(() => import('./views/FullscreenHearing/FullscreenHearingContainer'));
const LoginCallback = lazy(() => import('./views/Auth/loginCallback'));
const LogoutCallback = lazy(() => import('./views/Auth/logoutCallback'));
const UserHearings = lazy(() => import('./views/UserHearings'));
const UserProfile = lazy(() => import('./views/UserProfile'));

/* Vanilla Redirect component can't handle dynamic rerouting,
 * so we need Redirector to access params for the hearingSlug
 */
const Redirector = () => {
  const { hearingSlug } = useParams();
  return <Navigate to={`/${hearingSlug}`} />;
};

const AppRoutes = () => (
  <Suspense fallback={<LoadSpinner />}>
    <Routes>
      <Route path='/' element={<HomeContainer />} />
      <Route path='/silent-renew' element={<SilentRenew />} />
      <Route path='/info' element={<Info />} />
      {config.enableCookies && <Route path='/cookies' element={<CookieManagement />} />}
      <Route path='/callback' element={<LoginCallback />} />
      <Route path='/callback/logout' element={<LogoutCallback />} />
      <Route path='/user-hearings' element={<UserHearings />} />
      <Route path='/user-profile' element={<UserProfile />} />
      {config.showAccessibilityInfo && <Route path='/accessibility' element={<AccessibilityInfo />} />}
      <Route path='/hearings/:tab' element={<HearingsContainer />} />
      <Route path='/hearing/new' element={<NewHearingContainer />} />
      <Route path='/hearing/:hearingSlug' element={<Redirector />} />
      <Route path='/:hearingSlug/fullscreen' element={<FullscreenHearingContainer />} />
      <Route path='/:hearingSlug/:sectionId' element={<HearingContainer />} />
      <Route path='/:hearingSlug/*' element={<HearingContainer />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
