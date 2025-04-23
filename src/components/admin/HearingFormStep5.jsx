import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';
import { connect, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Select } from 'hds-react';
import { injectIntl, FormattedMessage, useIntl } from 'react-intl';

import { createNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import * as ProjectsSelector from '../../selectors/projectLists';
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
import Project from './Project';

const HearingFormStep5 = ({ errors, hearing, hearingLanguages, language, projects }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

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

  const [selectedProject, setSelectedProject] = useState(hearing.project);

  useEffect(() => {
    setSelectedProject(hearing.project);
  }, [hearing.project]);

  const onChangeProject = (selected) => {
    dispatch(
      changeProject({
        hearingSlug: hearing.slug,
        projectId: selected.value,
        projectLists: projects,
      }),
    );
  };

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

  const projectValue = options.find((option) => option.value === hearing.project?.id);

  return (
    <div>
      <div id='projectLists' style={{ marginBottom: 'var(--spacing-s)' }}>
        <Select
          optionKeyField='value'
          id='project'
          name='project'
          label={<FormattedMessage id='projectSelection' />}
          options={options}
          onChange={onChangeProject}
          value={projectValue}
        />
      </div>
      <Project
        project={selectedProject}
        errors={errors}
        hearingLanguages={hearingLanguages}
        onChangeProjectName={onChangeProjectName}
        onChangePhase={onChangePhase}
        deletePhase={deletePhase}
        onActivePhase={onActivePhase}
        addPhase={addPhase}
      />
    </div>
  );
};

HearingFormStep5.propTypes = {
  errors: PropTypes.object,
  projects: PropTypes.array,
  language: PropTypes.string,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (state) => ({
  projects: ProjectsSelector.getProjects(state),
});

export default connect(mapStateToProps)(injectIntl(HearingFormStep5));
