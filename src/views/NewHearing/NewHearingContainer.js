import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import HearingEditor from '../../components/admin/HearingEditor';
import { login } from '../../actions';
import { initNewHearing, fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import {getUser} from '../../selectors/user';
import LoadSpinner from '../../components/LoadSpinner';
import PleaseLogin from '../../components/admin/PleaseLogin';

export class NewHearingContainerComponent extends React.Component {
  componentDidMount() {
    const {fetchEditorMetaData, initHearing} = this.props;
    initHearing();
    fetchEditorMetaData();
  }

  render() {
    const {
      hearingDraft,
      hearingLanguages,
      labels,
      user,
      isLoading,
      contactPersons,
      loginAction
    } = this.props;
    return (
      <div>
        {!user
          ?
            <div className="hearing-page">
              <PleaseLogin login={loginAction} />
            </div>
          :
            <div>
              {(hearingDraft && user)
                ? <HearingEditor
                      hearing={hearingDraft}
                      hearingLanguages={hearingLanguages}
                      labels={labels}
                      user={user}
                      isLoading={isLoading}
                      contactPersons={contactPersons}
                      isNewHearing
                />
                : <LoadSpinner />
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
  loginAction: PropTypes.func,
  fetchEditorMetaData: PropTypes.func,
  initHearing: PropTypes.func,
};

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
  loginAction: () => dispatch(login())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHearingContainerComponent);
