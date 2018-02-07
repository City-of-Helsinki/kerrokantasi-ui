import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import Section from '../../components/Hearing/Section/SectionContainer';
import Header from '../../components/Hearing/Header';
import WrappedCarousel from '../../components/Carousel';
import {getHearingWithSlug} from '../../selectors/hearing';
import PropTypes from 'prop-types';
import {fetchHearing as fetchHearingAction, setLanguage as setLanguageAction} from '../../actions';
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
import Waypoint from 'react-waypoint';

export class HearingContainerComponent extends React.Component {
  state = {
    headerCollapsed: false
  }
  componentWillMount() {
    const {fetchHearing, fetchEditorMetaData, match: {params}} = this.props;
    fetchHearing(params.hearingSlug);
    fetchEditorMetaData();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.hearing) && nextProps.hearing.default_to_fullscreen) {
      this.history.push(`/${nextProps.hearing.hearing.slug}/fullscreen`);
    }
  }

  handleCollapseHeader = (waypointObj) => {
    if (waypointObj.currentPosition !== 'above') {
      this.setState({headerCollapsed: false});
    } else {
      this.setState({headerCollapsed: true});
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
    const {headerCollapsed} = this.state;
    const reportUrl = config.apiBaseUrl + '/v1/hearing/' + hearing.slug + '/report';

    return (
      <div className="hearing-page">

        {!isEmpty(hearing) ?
          <div>
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
              <Waypoint onEnter={(obj) => this.handleCollapseHeader(obj)} onLeave={(obj) => this.handleCollapseHeader(obj)} />
              {headerCollapsed &&
                <div
                  style={
                    {
                      background: 'orange',
                      minHeight: '30px',
                      color: 'black',
                      position: 'fixed',
                      left: '0',
                      right: '0',
                      top: document.getElementById('nav').offsetHeight,
                      zIndex: 1001,
                      padding: '10px 30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      fontSize: '28px',
                      fontWeight: '600'
                    }
                  }
                >
                  <div>{getAttr(hearing.title)}</div>
                  <div>&uarr;</div>
                </div>
              }
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
  setLanguage: (lang) => dispatch(setLanguageAction(lang))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HearingContainerComponent));
