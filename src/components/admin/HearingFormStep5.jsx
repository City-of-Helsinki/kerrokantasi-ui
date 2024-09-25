/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button, Notification, Select, TextInput } from 'hds-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Icon from '../../utils/Icon';
import { notifyError } from '../../utils/notify';
import { getValidationState } from '../../utils/hearingEditor';
import * as ProjectsSelector from '../../selectors/projectLists';
import Phase from './Phase';
import { hearingShape } from '../../types';
import {
  changeProjectName,
  changeProject,
  activePhase,
  deletePhase,
  addPhase,
  changePhase,
} from '../../actions/hearingEditor';

class HearingFormStep5 extends React.Component {
  onChangeProject = (selected) => {
    this.props.dispatch(
      changeProject({
        projectId: selected.value,
        projectLists: this.props.projects,
      }),
    );
  };

  addPhase = () => {
    const { hearingLanguages } = this.props;
    if (!isEmpty(hearingLanguages)) {
      return this.props.dispatch(addPhase());
    }
    return notifyError('Valitse ensin kieli.');
  };

  deletePhase = (phaseId) => {
    this.props.dispatch(deletePhase(phaseId));
  };

  onChangePhase = (phaseId, fieldName, language, value) => {
    this.props.dispatch(changePhase(phaseId, fieldName, language, value));
  };

  onChangeProjectName = (fieldname, value) => {
    this.props.dispatch(changeProjectName(fieldname, value));
  };

  onActivePhase = (phaseId) => {
    this.props.dispatch(activePhase(phaseId));
  };

  renderProject = (selectedProject) => {
    const { hearing, hearingLanguages, errors } = this.props;
    const phasesLength = hearing.project ? hearing.project.phases.length : null;
    const errorStyle = getValidationState(errors, 'project_phase_active') && phasesLength === 0 ? 'has-error' : null;

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
                onBlur={(event) => this.onChangeProjectName(usedLanguage, event.target.value)}
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
                  onChange={this.onChangePhase}
                  phaseInfo={phase}
                  key={key}
                  indexNumber={index}
                  onDelete={this.deletePhase}
                  onActive={this.onActivePhase}
                  languages={hearingLanguages}
                  errors={errors}
                />
              );
            })}
        </div>
        {selectedProject && (
          <div>
            <Button className={classNames([errorStyle, 'kerrokantasi-btn'])} onClick={this.addPhase} size='small'>
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

  render() {
    const { projects, language, hearing, intl } = this.props;
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

    return (
      <div>
        <div id='projectLists' style={{ marginBottom: 'var(--spacing-s)' }}>
          <Select
            optionKeyField='value'
            id='commenting'
            name='commenting'
            label={<FormattedMessage id='projectSelection' />}
            options={[...defaultProjectOptions, ...projectsOptions]}
            onChange={this.onChangeProject}
          />
        </div>
        {this.renderProject(selectedProject)}
      </div>
    );
  }
}

HearingFormStep5.propTypes = {
  errors: PropTypes.object,
  projects: PropTypes.array,
  dispatch: PropTypes.func,
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
