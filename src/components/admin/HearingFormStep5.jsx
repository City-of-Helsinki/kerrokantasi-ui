/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';
import { connect, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button, Notification, Select, TextInput } from 'hds-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Icon from '../../utils/Icon';
import { createNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import * as ProjectsSelector from '../../selectors/projectLists';
import Phase from './Phase';
import { hearingShape } from '../../types';
import {
  changeProjectName,
  changeProject,
  activePhase,
  deletePhase as deletePhaseFn,
  addPhase as addPhaseFn,
  changePhase,
} from '../../actions/hearingEditor';
import { addToast } from '../../actions/toast';

const HearingFormStep5 = ({ errors, hearing, hearingLanguages, language, projects, intl }) => {
  const dispatch = useDispatch();

  const onChangeProject = (selected) =>
    dispatch(
      changeProject({
        projectId: selected.value,
        projectLists: projects,
      }),
    );

  const addPhase = () => {
    if (!isEmpty(hearingLanguages)) {
      return dispatch(addPhaseFn());
    }

    return dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Valitse ensin kieli.')));
  };

  const deletePhase = (phaseId) => dispatch(deletePhaseFn(phaseId));

  const onChangePhase = (phaseId, fieldName, phaseLanguage, value) =>
    dispatch(changePhase(phaseId, fieldName, phaseLanguage, value));

  const onChangeProjectName = (fieldname, value) => dispatch(changeProjectName(fieldname, value));

  const onActivePhase = (phaseId) => dispatch(activePhase(phaseId));

  const renderProject = (selectedProject) => {
    const phasesLength = hearing.project ? hearing.project.phases.length : null;
    const errorStyle = !errors.project_phase_active && phasesLength === 0 ? 'has-error' : null;

    return (
      <div>
        {selectedProject &&
          hearingLanguages.map((usedLanguage) => (
            <div id='projectName' key={usedLanguage}>
              <TextInput
                id='projectName'
                name='projectName'
                label={
                  <>
                    <FormattedMessage id='projectName' /> ({usedLanguage})
                  </>
                }
                maxLength={100}
                value={selectedProject.title[usedLanguage]}
                onBlur={(event) => onChangeProjectName(usedLanguage, event.target.value)}
                invalid={!!errors.project_title}
                errorText={errors.project_title}
                style={{ marginBottom: 'var(--spacing-s)' }}
                required
              />
            </div>
          ))}
        <div className='phases-container'>
          {selectedProject &&
            selectedProject.phases.map((phase, index) => {
              const key = index;

              return (
                <Phase
                  onChange={onChangePhase}
                  phaseInfo={phase}
                  key={key}
                  indexNumber={index}
                  onDelete={deletePhase}
                  onActive={onActivePhase}
                  languages={hearingLanguages}
                  errors={errors}
                />
              );
            })}
        </div>
        {selectedProject && (
          <div>
            <Button className={classNames([errorStyle, 'kerrokantasi-btn'])} onClick={addPhase} size='small'>
              <Icon className='icon' name='plus' /> <FormattedMessage id='addProcess'>{(txt) => txt}</FormattedMessage>
            </Button>
          </div>
        )}
        {!!errors.project_phase_active && phasesLength === 0 && (
          <Notification type='error' size='small'>
            {errors.project_phase_active}
          </Notification>
        )}
      </div>
    );
  };

  const selectedProject = hearing.project;

  const defaultProjectOptions = [
    { value: uuid(), label: intl.formatMessage({ id: 'noProject' }) },
    { value: '', label: intl.formatMessage({ id: 'defaultProject' }) },
  ];

  const projectsOptions = projects.map((project) => ({
    value: project.id,
    label: `${
      project.title[language] || project.title.fi || project.title.en || project.title.sv || 'Default project'
    }`,
  }));

  const options = [...defaultProjectOptions, ...projectsOptions];

  const projectsInitialValue = selectedProject?.id ? selectedProject.id : options[0];

  return (
    <div>
      <div id='projectLists' style={{ marginBottom: 'var(--spacing-s)' }}>
        <Select
          optionKeyField='value'
          id='commenting'
          name='commenting'
          label={<FormattedMessage id='projectSelection' />}
          options={options}
          onChange={onChangeProject}
          defaultValue={projectsInitialValue}
        />
      </div>
      {renderProject(selectedProject)}
    </div>
  );
};

HearingFormStep5.propTypes = {
  errors: PropTypes.object,
  projects: PropTypes.array,
  language: PropTypes.string,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  intl: PropTypes.object,
};

const mapStateToProps = (state) => ({
  projects: ProjectsSelector.getProjects(state),
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
