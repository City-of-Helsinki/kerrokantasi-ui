import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './App';
import AllHearings from './views/AllHearings';
import Hearing from './views/Hearing';
import HearingMap from './views/HearingMap';
import Home from './views/Home';
import Info from './views/Info';
import QuestionView from './views/QuestionView';
import config from './config';

function trackLink() {
  /* global Piwik */
  try {
    const tracker = Piwik.getTracker(config.uiConfig.piwikUrl, 2);
    tracker.trackLink(document.URL);
  } catch (err) {
    /* When entering the site, Piwik is not yet defined. Entering will
    be tracked by Piwik once it has finished loading.
     */
  }
}

export default (
  <Route path="/" component={App} onEnter={trackLink}>
    <IndexRoute component={Home} onEnter={trackLink}/>
    <Route path="/info" component={Info} onEnter={trackLink}/>
    <Route path="/map" component={HearingMap} onEnter={trackLink}/>
    <Route path="/hearings/:tab" component={AllHearings} onEnter={trackLink}/>
    <Route path="/hearing/(:hearingSlug)" component={Hearing} onEnter={trackLink}/>
    <Route path="/hearing/:hearingSlug/:sectionId" component={QuestionView} onEnter={trackLink}/>
    <Route path="/(:hearingSlug)" component={Hearing} onEnter={trackLink}/>
  </Route>
);
