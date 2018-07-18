import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import Section from '../../components/Hearing/Section/SectionContainer';
import Header from '../../components/Hearing/Header';
import WrappedCarousel from '../../components/Carousel';
import {getHearingWithSlug} from '../../selectors/hearing';
import PropTypes from 'prop-types';
import {fetchHearing as fetchHearingAction, setLanguage as setLanguageAction, fetchProjects} from '../../actions';
import LoadSpinner from '../../components/LoadSpinner';
import isEmpty from 'lodash/isEmpty';
import { injectIntl, intlShape } from 'react-intl';
import {canEdit} from '../../utils/hearing';
import HearingEditor from '../../components/admin/HearingEditor';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import { fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import {getUser} from '../../selectors/user';
import config from '../../config';
import getAttr from '../../utils/getAttr';
import Helmet from 'react-helmet';

export class HearingContainerComponent extends React.Component {
  componentWillMount() {
    const {fetchProjectsList, fetchHearing, fetchEditorMetaData, match: {params}} = this.props;
    fetchHearing(params.hearingSlug);
    fetchEditorMetaData();
    fetchProjectsList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state) {
      if (!isEmpty(nextProps.hearing) && nextProps.hearing.default_to_fullscreen && !nextProps.location.state.fromFullscreen) {
        this.props.history.push({pathname: `/${nextProps.hearing.slug}/fullscreen`, search: `?lang=${this.props.language}`});
      }
    } else if (!isEmpty(nextProps.hearing) && nextProps.hearing.default_to_fullscreen) {
      this.props.history.push({pathname: `/${nextProps.hearing.slug}/fullscreen`, search: `?lang=${this.props.language}`});
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

    const reportUrl = config.apiBaseUrl + '/v1/hearing/' + hearing.slug + '/report';
    return (
      <div className="hearing-page">

        {!isEmpty(hearing) ?
          <div>
            <Helmet title={getAttr(hearing.title, language)} />
            {(!isEmpty(user) && canEdit(user, hearing)) &&
              <HearingEditor
                hearing={hearingDraft}
                hearingLanguages={hearingLanguages}
                labels={labels}
                user={user}
                isLoading={isLoading}
                contactPersons={contactPersons}
              />
            }
            <div className="hearing-wrapper" id="hearing-wrapper">
              <Header
                hearing={hearing}
                activeLanguage={language}
                intl={intl}
                reportUrl={reportUrl}
                setLanguage={setLanguage}
              />
              <WrappedCarousel hearing={hearing} intl={intl} language={language}/>
              <Switch>
                <Route path="/:hearingSlug/:sectionId" component={Section} />
                <Route path="/:hearingSlug" component={Section} />
              </Switch>
            </div>
          </div>
        : <LoadSpinner />
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
