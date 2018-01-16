import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import Section from '../../components/Hearing/Section/SectionContainer';
import Header from '../../components/Hearing/Header';
import WrappedCarousel from '../../components/Carousel';
import {getHearingWithSlug} from '../../selectors/hearing';
import PropTypes from 'prop-types';
import {fetchHearing as fetchHearingAction} from '../../actions';
import LoadSpinner from '../../components/LoadSpinner';
import isEmpty from 'lodash/isEmpty';
import { injectIntl, intlShape } from 'react-intl';
import {SectionTypes} from '../../utils/section';
import {canEdit} from '../../utils/hearing';
import HearingEditor from '../../components/admin/HearingEditor';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import { initNewHearing, fetchHearingEditorMetaData } from '../../actions/hearingEditor';

export class HearingContainer extends React.Component {
  componentWillMount() {
    const {fetchHearing, fetchEditorMetaData, match: {params}} = this.props;
    fetchHearing(params.hearingSlug);
    fetchEditorMetaData();
  }

  render() {
    const {
      hearing,
      intl,
      language,
      match,
      user,
      labels,
      hearingDraft,
      hearingLanguages,
      isLoading,
      contactPersons
    } = this.props;
    const mainSectionId = !isEmpty(hearing) ? hearing.sections.find(section => section.type === SectionTypes.MAIN).id : null;

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
              <Header hearing={hearing} activeLanguage={language} intl={intl}/>
              <WrappedCarousel hearing={hearing} intl={intl} language={language}/>
              <Switch>
                <Route path="/:hearingSlug/:sectionId" component={Section} />
                <Redirect from="/:hearingSlug" to={`/${match.params.hearingSlug}/${mainSectionId}`} />
              </Switch>
            </div>
          </div>
        : <LoadSpinner />
      }
      </div>

    );
  }
}

HearingContainer.propTypes = {
  hearing: PropTypes.object,
  intl: intlShape.isRequired,
  language: PropTypes.string,
  match: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  language: state.language,
  hearingDraft: HearingEditorSelector.getPopulatedHearing(state),
  hearingLanguages: state.hearingEditor.languages,
  labels: HearingEditorSelector.getLabels(state),
  user: state.user,
  isLoading: HearingEditorSelector.getIsLoading(state),
  contactPersons: HearingEditorSelector.getContactPersons(state)
});

const mapDispatchToProps = dispatch => ({
  fetchHearing: (hearingSlug, preview = false) => dispatch(fetchHearingAction(hearingSlug, preview)),
  fetchEditorMetaData: () => dispatch(fetchHearingEditorMetaData())
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HearingContainer));
