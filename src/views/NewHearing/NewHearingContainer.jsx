import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HearingEditor from '../../components/admin/HearingEditor';
import { fetchProjects } from '../../actions';
import { initNewHearing, fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import getUser from '../../selectors/user';
import LoadSpinner from '../../components/LoadSpinner';
import PleaseLogin from '../../components/admin/PleaseLogin';
import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import { contactShape, organizationShape } from '../../types';
import useAuthHook from '../../hooks/useAuth';
import { addToast } from '../../actions/toast';

function NewHearingContainerComponent(props) {
  const { login } = useAuthHook();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'loginAttemptFailed')));
    }
  };

  const [hasLoaded, setHasLoaded] = useState(false);

  const { hearingDraft, hearingLanguages, labels, user, isLoading, contactPersons, organizations } = props;
  const { fetchEditorMetaData, initHearing, fetchProjectsList } = props;

  useEffect(() => {
    if (!hasLoaded && user) {
      setHasLoaded(true);
      initHearing();
      fetchEditorMetaData();
      fetchProjectsList();
    }
  }, [fetchEditorMetaData, initHearing, fetchProjectsList, hasLoaded, user]);

  return (
    <div>
      {isLoading && !hasLoaded ? (
        <LoadSpinner />
      ) : (
        <div>
          {!user ? (
            <div className='hearing-page'>
              <PleaseLogin login={handleLogin} />
            </div>
          ) : (
            <div>
              <HearingEditor
                hearing={hearingDraft}
                hearingLanguages={hearingLanguages}
                labels={labels}
                user={user}
                isLoading={isLoading}
                contactPersons={contactPersons}
                organizations={organizations}
                isNewHearing
                navigate={navigate}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

NewHearingContainerComponent.propTypes = {
  hearingDraft: PropTypes.object,
  hearingLanguages: PropTypes.array,
  labels: PropTypes.array,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
  contactPersons: PropTypes.arrayOf(contactShape),
  organizations: PropTypes.arrayOf(organizationShape),
  fetchEditorMetaData: PropTypes.func,
  initHearing: PropTypes.func,
  fetchProjectsList: PropTypes.func,
};

const mapStateToProps = (state) => ({
  language: state.language,
  hearingDraft: HearingEditorSelector.getPopulatedHearing(state),
  hearingLanguages: state.hearingEditor.languages,
  labels: HearingEditorSelector.getLabels(state),
  user: getUser(state),
  isLoading: HearingEditorSelector.getIsLoading(state),
  contactPersons: HearingEditorSelector.getContactPersons(state),
  organizations: state.hearingEditor.organizations.all,
});

const mapDispatchToProps = (dispatch) => ({
  fetchEditorMetaData: () => dispatch(fetchHearingEditorMetaData()),
  initHearing: () => dispatch(initNewHearing()),
  fetchProjectsList: () => dispatch(fetchProjects()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHearingContainerComponent);
