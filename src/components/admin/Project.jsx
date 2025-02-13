import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Notification, TextInput } from 'hds-react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import Phase from './Phase';
import Icon from '../../utils/Icon';

const Project = ({
  project,
  errors,
  hearingLanguages,
  onChangeProjectName,
  onChangePhase,
  deletePhase,
  onActivePhase,
  addPhase,
}) => {
  const getProjectTitles = (selector) =>
    hearingLanguages.reduce((acc, current) => {
      if (!isEmpty(selector?.title)) {
        acc[current] = selector?.title[current];
      }

      return acc;
    }, {});

  const projectTitlesInitial = getProjectTitles(project);

  const [selectedTitles, setSelectedTitles] = useState(projectTitlesInitial);

  useEffect(() => {
    setSelectedTitles(!isEmpty(getProjectTitles(project)) ? getProjectTitles(project) : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) {
    return null;
  }

  const phasesLength = project.phases ? project.phases.length : null;
  const errorStyle = !errors.project_phase_active && phasesLength === 0 ? 'has-error' : null;

  return (
    <div>
      {hearingLanguages.map((usedLanguage) => (
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
            value={selectedTitles ? selectedTitles[usedLanguage] : ''}
            onChange={(event) => {
              const { value } = event.target;

              setSelectedTitles((prevState) => ({ ...prevState, [usedLanguage]: value }));
              onChangeProjectName(usedLanguage, value);
            }}
            invalid={!!errors.project_title}
            errorText={errors.project_title}
            style={{ marginBottom: 'var(--spacing-s)' }}
            required
          />
        </div>
      ))}
      <div className='phases-container'>
        {project.phases?.map((phase, index) => {
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

      <div>
        <Button className={classNames([errorStyle, 'kerrokantasi-btn'])} onClick={addPhase} size='small'>
          <Icon className='icon' name='plus' /> <FormattedMessage id='addProcess'>{(txt) => txt}</FormattedMessage>
        </Button>
      </div>

      {!!errors.project_phase_active && phasesLength === 0 && (
        <Notification type='error' size='small'>
          {errors.project_phase_active}
        </Notification>
      )}
    </div>
  );
};

Project.propTypes = {
  project: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    phases: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.shape({
      en: PropTypes.string,
      fi: PropTypes.string,
      sv: PropTypes.string,
    }),
  }).isRequired,
  errors: PropTypes.shape({
    project_phase_active: PropTypes.string,
    project_title: PropTypes.string,
  }).isRequired,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChangeProjectName: PropTypes.func.isRequired,
  onChangePhase: PropTypes.func.isRequired,
  deletePhase: PropTypes.func.isRequired,
  onActivePhase: PropTypes.func.isRequired,
  addPhase: PropTypes.func.isRequired,
};

export default Project;
