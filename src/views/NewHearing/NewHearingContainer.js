import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import HearingEditor from '../../components/admin/HearingEditor';
import { fetchProjects } from '../../actions';
import { initNewHearing, fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import {getUser} from '../../selectors/user';
import LoadSpinner from '../../components/LoadSpinner';
import PleaseLogin from '../../components/admin/PleaseLogin';
import userManager from "../../utils/userManager";
import { localizedNotifyError } from '../../utils/notify';

export class NewHearingContainerComponent extends React.Component {
  componentDidMount() {
    const {fetchEditorMetaData, initHearing, fetchProjectsList} = this.props;
    initHearing();
    fetchEditorMetaData();
    fetchProjectsList();
  }

  render() {
    const {
      hearingDraft,
      hearingLanguages,
      labels,
      user,
      isLoading,
      contactPersons,
    } = this.props;
    return (
      <div>
        {isLoading
          ? <LoadSpinner />
          :
          <div>
            {!user
              ?
                <div className="hearing-page">
                  <PleaseLogin login={handleLogin} />
                </div>
              :
                <HearingEditor
                  hearing={hearingDraft}
                  hearingLanguages={hearingLanguages}
                  labels={labels}
                  user={user}
                  isLoading={isLoading}
                  contactPersons={contactPersons}
                  isNewHearing
                />
            }
          </div>
        }
      </div>
    );
  }
}

NewHearingContainerComponent.propTypes = {
  hearingDraft: PropTypes.object,
  hearingLanguages: PropTypes.array,
  labels: PropTypes.array,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
  contactPersons: PropTypes.array,
  fetchEditorMetaData: PropTypes.func,
  initHearing: PropTypes.func,
  fetchProjectsList: PropTypes.func
};

async function handleLogin() {
  try {
    await userManager.signinRedirect();
  } catch (error) {
    localizedNotifyError("loginAttemptFailed");
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
  initHearing: () => dispatch(initNewHearing()),
  fetchProjectsList: () => dispatch(fetchProjects())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHearingContainerComponent);
