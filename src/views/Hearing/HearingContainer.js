import React, { lazy, Suspense } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import * as HearingEditorSelector from '../../selectors/hearingEditor';
import Header from '../../components/Hearing/Header';
import LoadSpinner from '../../components/LoadSpinner';
import Section from '../../components/Hearing/Section/SectionContainer';
import getAttr from '../../utils/getAttr';
import { canEdit } from '../../utils/hearing';
import { fetchHearing as fetchHearingAction, setLanguage as setLanguageAction, fetchProjects } from '../../actions';
import { fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import { getHearingWithSlug } from '../../selectors/hearing';
import { getUser } from '../../selectors/user';

const HearingEditor = lazy(() => import(/* webpackChunkName: "editor" */'../../components/admin/HearingEditor'));

export class HearingContainerComponent extends React.Component {
  componentWillMount() {
    const {fetchProjectsList, fetchHearing, fetchEditorMetaData, match: {params}, location} = this.props;
    if (location.search.startsWith('?preview')) {
      fetchHearing(params.hearingSlug, location.search.substring(9));
    } else {
      fetchHearing(params.hearingSlug);
    }
    fetchEditorMetaData();
    fetchProjectsList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state) {
      if (!isEmpty(nextProps.hearing)
        && nextProps.hearing.default_to_fullscreen
        && !nextProps.location.state.fromFullscreen) {
        this.props.history.push({
          pathname: `/${nextProps.hearing.slug}/fullscreen`,
          search: `?lang=${this.props.language}`
        });
      }
    } else if (!isEmpty(nextProps.hearing) && nextProps.hearing.default_to_fullscreen) {
      this.props.history.push({
        pathname: `/${nextProps.hearing.slug}/fullscreen`,
        search: `?lang=${this.props.language}`
      });
    }
    if (isEmpty(this.props.user) && isEmpty(this.props.hearing) && !isEmpty(nextProps.user)) {
      this.props.fetchHearing(nextProps.match.params.hearingSlug);
    }

    // re-render/fetch when navigate from a hearing container to another hearing container
    // since the component doesn't mount again
    if (nextProps.match.path === this.props.match.path
        && nextProps.location.pathname !== this.props.location.pathname
    ) {
      const { fetchHearing, fetchEditorMetaData, match: { params } } = nextProps;
      fetchHearing(params.hearingSlug);
      fetchEditorMetaData();
    }
  }

  render() {
    const {
      hearing,
      intl,
      language,
      user,
      labels,
      hearingDraft,
      hearingLanguages,
      isLoading,
      contactPersons,
      setLanguage
    } = this.props;

    return (
      <div className="hearing-page">
        {!isEmpty(hearing) ? (
          <React.Fragment>
            <Helmet title={getAttr(hearing.title, language)} />
            {(!isEmpty(user) && canEdit(user, hearing)) &&
              <Suspense fallback={<LoadSpinner />}>
                <HearingEditor
                  hearing={hearingDraft}
                  hearingLanguages={hearingLanguages}
                  labels={labels}
                  user={user}
                  isLoading={isLoading}
                  contactPersons={contactPersons}
                />
              </Suspense>
            }
            <div className="hearing-wrapper" id="hearing-wrapper">
              <Header
                hearing={hearing}
                activeLanguage={language}
                intl={intl}
                setLanguage={setLanguage}
              />
              <Switch>
                <Route path="/:hearingSlug/:sectionId" component={Section} />
                <Route path="/:hearingSlug" component={Section} />
              </Switch>
            </div>
          </React.Fragment>
          ) : (
            <LoadSpinner />
          )
        }
      </div>
    );
  }
}

HearingContainerComponent.propTypes = {
  hearing: PropTypes.object,
  intl: intlShape.isRequired,
  language: PropTypes.string,
  match: PropTypes.object,
  user: PropTypes.object,
  labels: PropTypes.array,
  hearingDraft: PropTypes.object,
  hearingLanguages: PropTypes.array,
  isLoading: PropTypes.bool,
  contactPersons: PropTypes.array,
  fetchHearing: PropTypes.func,
  fetchEditorMetaData: PropTypes.func,
  setLanguage: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  fetchProjectsList: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  language: state.language,
  hearingDraft: HearingEditorSelector.getPopulatedHearing(state),
  hearingLanguages: state.hearingEditor.languages,
  labels: HearingEditorSelector.getLabels(state),
  user: getUser(state),
  isLoading: HearingEditorSelector.getIsLoading(state),
  contactPersons: HearingEditorSelector.getContactPersons(state)
});

const mapDispatchToProps = dispatch => ({
  fetchHearing: (hearingSlug, preview = false) => dispatch(fetchHearingAction(hearingSlug, preview)),
  fetchEditorMetaData: () => dispatch(fetchHearingEditorMetaData()),
  setLanguage: (lang) => dispatch(setLanguageAction(lang)),
  fetchProjectsList: () => dispatch(fetchProjects())
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HearingContainerComponent));
