import React from 'react';
import {connect} from 'react-redux';
import HearingEditor from '../../components/admin/HearingEditor';
import { initNewHearing, fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import {getUser} from '../../selectors/user';

export class NewHearingContainer extends React.Component {
  componentWillMount() {
    const {fetchEditorMetaData, initHearing} = this.props;
    fetchEditorMetaData();
    initHearing();
  }
  render() {
    const {
      hearingDraft,
      hearingLanguages,
      labels,
      user,
      isLoading,
      contactPersons
    } = this.props;
    return (
      <div>
        {hearingDraft &&
        <HearingEditor
          hearing={hearingDraft}
          hearingLanguages={hearingLanguages}
          labels={labels}
          user={user}
          isLoading={isLoading}
          contactPersons={contactPersons}
        />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.language,
  hearingDraft: HearingEditorSelector.getPopulatedHearing(state),
  hearingLanguages: state.hearingEditor.languages,
  labels: HearingEditorSelector.getLabels(state),
  user: getUser(state),
  isLoading: HearingEditorSelector.getIsLoading(state),
  contactPersons: HearingEditorSelector.getContactPersons(state)
});

const mapDispatchToProps = dispatch => ({
  fetchEditorMetaData: () => dispatch(fetchHearingEditorMetaData()),
  initHearing: () => dispatch(initNewHearing())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHearingContainer);
