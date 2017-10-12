import FullscreenHearing from '../../components/FullscreenHearing';
import DefaultHearingComponent from '../../components/Hearing';
import Helmet from 'react-helmet';
import LoadSpinner from '../../components/LoadSpinner';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchHearing, changeCurrentlyViewed, login } from '../../actions';
import { initNewHearing, fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import { getMainSection, canEdit, getHearingURL, getOpenGraphMetaData } from '../../utils/hearing';
import HearingEditor from '../../components/admin/HearingEditor';
import { contactShape, hearingShape, labelShape } from '../../types';
import { injectIntl, intlShape } from 'react-intl';
import { getUser } from '../../selectors/user';
import { withRouter } from 'react-router-dom';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import getAttr from '../../utils/getAttr';
import PleaseLogin from '../../components/admin/PleaseLogin';
import qs from 'qs';

export class HearingView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentlyViewed: 'hearing', manager: false };
    this.changeCurrentlyViewed = this.changeCurrentlyViewed.bind(this);
  }
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the HearingView view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @param getState Redux state getter
   * @param location Router location
   * @param params Router match.params
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch, getState, location, params) {
    return dispatch(fetchHearing(params.hearingSlug, qs.parse(location.search).preview));
  }

  /**
   * Return truthy if the view can be rendered fully with the data currently
   * acquirable by `getState()`.
   *
   * @param getState State getter
   * @param location Router location
   * @param params Router match.params
   * @return {boolean} Renderable?
   */
  static canRenderFully(getState, location, params) {
    const { state, data } = getState().hearing[params.hearingSlug] || { state: 'initial' };
    return state === 'done' && data;
  }

  isNewHearing() {
    return !this.props.match.params.hearingSlug;
  }

  componentWillMount() {
    console.log('here');

    const { dispatch, match: { params }, location } = this.props;
    // The manager might not have a hearing yet
    if (location.pathname === '/hearing/new') {
      this.setState({ manager: true });
    } else if (!this.state.manager) {
      HearingView.fetchData(dispatch, null, location, params);
    }
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  componentDidMount() {
    if (this.isNewHearing()) {
      this.props.dispatch(initNewHearing());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match: { params }, location } = this.props;
    if (!this.isNewHearing()) {
      const { state: receivedHearingState, data: receivedHearing } = nextProps.hearing[params.hearingSlug];
      const existingUser = this.props.user;
      const receivedUser = nextProps.user;
      // check manager and hearing status whenever user or hearing is received
      if ((!existingUser && receivedUser) || (!this.getHearing() && receivedHearingState === 'done')) {
        // the hearing might not be present yet, if it is invisible without login
        if (receivedHearingState === 'done') {
          if (canEdit(receivedUser, receivedHearing)) {
            this.setState({ manager: true });
          }
        } else {
          HearingView.fetchData(dispatch, null, location, params);
        }
      }
      // go to regular mode if the authorized user logged out
      if (
        this.state.manager &&
        receivedHearingState === 'done' &&
        (!receivedUser || !canEdit(receivedUser, receivedHearing))
      ) {
        this.setState({ manager: false });
      }
      // after logging out, the hearing might not be available anymore
      if (existingUser && !receivedUser) {
        HearingView.fetchData(dispatch, null, location, params);
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { dispatch } = this.props;
    if (nextState.manager) {
      // the manager needs its metadata to devour
      const shouldFetchMetadata =
        !nextProps.isLoading && (!nextProps.labels.length || !nextProps.contactPersons.length);
      if (shouldFetchMetadata) {
        dispatch(fetchHearingEditorMetaData());
      }
    }
  }

  changeCurrentlyViewed(viewedItem) {
    changeCurrentlyViewed(this.props.dispatch, viewedItem);
  }

  // eslint-disable-next-line class-methods-use-this
  renderSpinner() {
    return (
      <div className="container">
        <LoadSpinner />
      </div>
    );
  }

  checkNeedForFullscreen() {
    const hearing = this.getHearing();
    if (!hearing) {
      return false;
    }
    const fullscreenParam = qs.parse(this.props.location.search).fullscreen;
    const requiresFullscreen = getMainSection(hearing).plugin_fullscreen;
    if (requiresFullscreen && fullscreenParam === undefined) {
      // Looks like we need fullscreen mode, but we aren't currently using it.
      // Let's redirect to proper hearing URL
      this.props.history.push(getHearingURL(hearing));
    }
    return fullscreenParam === 'true';
  }

  getHearing() {
    if (this.isNewHearing()) {
      return null;
    }
    const { hearingSlug } = this.props.match.params;
    const { state, data: hearing } = this.props.hearing[hearingSlug] || { state: 'initial' };
    if (state === 'done') {
      return hearing;
    }
    return null;
  }

  render() {
    const hearing = this.getHearing();
    const {
      user,
      language,
      dispatch,
      currentlyViewed,
      match: { params },
      contactPersons,
      isLoading,
      hearingDraft,
      labels,
      hearingLanguages,
    } = this.props;
    const fullscreen = this.checkNeedForFullscreen();
    const HearingComponent = fullscreen ? FullscreenHearing : DefaultHearingComponent;
    if (!this.state.manager) {
      // this is the standard hearing view with no wrappers around it
      if (!hearing) {
        return this.renderSpinner();
      }
      return (
        <div key="hearing" className={fullscreen ? 'fullscreen-hearing' : 'container'}>
          <Helmet title={getAttr(hearing.title, language)} meta={getOpenGraphMetaData(hearing, language)} />
          <HearingComponent
            hearingSlug={params.hearingSlug}
            hearing={hearing}
            user={user}
            sectionComments={this.props.sectionComments}
            location={this.props.location}
            dispatch={dispatch}
            changeCurrentlyViewed={this.changeCurrentlyViewed}
            currentlyViewed={currentlyViewed}
          />
        </div>
      );
    }

    // this is the manager
    if (!user) {
      return (
        <div className="container">
          <PleaseLogin login={() => dispatch(login())} />
        </div>
      );
    }

    if (!hearingDraft) {
      return (
        <div className="container">
          <this.renderSpinner />
        </div>
      );
    }

    const PreviewReplacement = () => (this.isNewHearing() ? null : <this.renderSpinner />);

    return (
      <div className="container">
        <Helmet title={getAttr(hearingDraft.title, language)} meta={getOpenGraphMetaData(hearingDraft, language)} />

        <HearingEditor
          hearing={hearingDraft}
          hearingLanguages={hearingLanguages}
          labels={labels}
          user={user}
          isLoading={isLoading}
          contactPersons={contactPersons}
        />

        {(isLoading && !hearingDraft) || (hearing && Object.keys(hearing).length && hearing.title) ? (
          <HearingComponent
            hearingSlug={params.hearingSlug}
            hearing={hearing}
            user={user}
            sectionComments={this.props.sectionComments}
            location={this.props.location}
            dispatch={dispatch}
            changeCurrentlyViewed={this.changeCurrentlyViewed}
            currentlyViewed={currentlyViewed}
          />
        ) : (
          <PreviewReplacement />
        )}
      </div>
    );
  }
}

HearingView.propTypes = {
  dispatch: PropTypes.func,
  hearing: hearingShape,
  match: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  user: PropTypes.object,
  sectionComments: PropTypes.object,
  currentlyViewed: PropTypes.string,
  contactPersons: PropTypes.arrayOf(contactShape),
  intl: intlShape.isRequired,
  isLoading: PropTypes.bool,
  hearingDraft: hearingShape,
  labels: PropTypes.arrayOf(labelShape),
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  history: PropTypes.object,
};

export function wrapHearingView(view) {
  const wrappedView = connect(state => ({
    contactPersons: HearingEditorSelector.getContactPersons(state),
    user: getUser(state),
    hearing: state.hearing,
    hearingDraft: HearingEditorSelector.getPopulatedHearing(state),
    hearingLanguages: state.hearingEditor.languages,
    isLoading: HearingEditorSelector.getIsLoading(state),
    labels: HearingEditorSelector.getLabels(state),
    sectionComments: state.sectionComments,
    language: state.language,
    errors: state.hearingEditor.errors,
    isSaving: HearingEditorSelector.getIsSaving(state),
    currentlyViewed: state.hearing.currentlyViewed,
  }))(injectIntl(view));

  // We need to re-hoist the data statics to the wrapped component due to react-intl:
  wrappedView.canRenderFully = view.canRenderFully;
  wrappedView.fetchData = view.fetchData;
  return wrappedView;
}

export default withRouter(wrapHearingView(HearingView));
