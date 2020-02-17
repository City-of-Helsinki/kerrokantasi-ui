// @flow

import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import {connect} from 'react-redux';
import {isEmpty} from 'lodash';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Icon from '../../utils/Icon';
import {notifyError} from '../../utils/notify';
import {injectIntl, FormattedMessage} from 'react-intl';
import FormControlOnChange from '../forms/FormControlOnChange';
import * as ProjectsSelector from '../../selectors/projectLists';
import Phase from './Phase';
import {hearingShape} from '../../types';
import {
  changeProjectName,
  changeProject,
  activePhase,
  deletePhase,
  addPhase,
  changePhase
} from '../../actions/hearingEditor';

class HearingFormStep5 extends React.Component {
  onChangeProject = (event) => {
    this.props.dispatch(changeProject({
      projectId: event.target.value,
      projectLists: this.props.projects
    }));
  }
  addPhase = () => {
    const {hearingLanguages} = this.props;
    if (!isEmpty(hearingLanguages)) {
      return this.props.dispatch(addPhase());
    }
    return notifyError('Valitse ensin kieli.');
  }
  deletePhase = (phaseId) => {
    this.props.dispatch(deletePhase(phaseId));
  }
  onChangePhase = (phaseId, fieldName, language, value) => {
    this.props.dispatch(
      changePhase(phaseId, fieldName, language, value)
    );
  }
  onChangeProjectName = (fieldname, value) => {
    this.props.dispatch(
      changeProjectName(fieldname, value)
    );
  }
  onActivePhase = (phaseId) => {
    this.props.dispatch(activePhase(phaseId));
  }
  renderProject = (selectedProject) => {
    const {hearingLanguages} = this.props;

    return (
      <div>
        {
          selectedProject && hearingLanguages.map(usedLanguage => (
            <FormGroup controlId="projectName" key={usedLanguage}>
              <ControlLabel><FormattedMessage id="projectName"/> ({usedLanguage})* </ControlLabel>
              <FormControlOnChange
                maxLength="100"
                defaultValue={selectedProject.title[usedLanguage]}
                onBlur={(event) => {
                  this.onChangeProjectName(usedLanguage, event.target.value);
                }}
                type="text"
              />
            </FormGroup>
          ))
        }
        <div className="phases-container">
          {
            selectedProject && selectedProject.phases.map((phase, index) => {
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
                />
              );
            })
          }
        </div>
        {
          selectedProject && (
            <ButtonToolbar>
              <Button
                onClick={this.addPhase}
                bsSize="small"
                bsStyle="default"
              >
                <Icon className="icon" name="plus"/> <FormattedMessage id="addProcess"/>
              </Button>
            </ButtonToolbar>
          )
        }
      </div>
    );
  }
  render() {
    const {projects, language, hearing, intl} = this.props;
    const selectedProject = hearing.project;

    return (
      <div>
        <FormGroup controlId="projectLists">
          <ControlLabel><FormattedMessage id="projectSelection"/></ControlLabel>
          <div className="select">
            <FormControl
              componentClass="select"
              name="commenting"
              value={selectedProject && selectedProject.id}
              onChange={this.onChangeProject}
            >
              <option value={uuid()}>{intl.formatMessage({ id: 'noProject' })}</option>
              <option value="">{intl.formatMessage({ id: 'defaultProject' })}</option>
              <option disabled >──────────</option>
              {
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {`${project.title[language] || project.title.fi ||
                      project.title.en || project.title.sv || 'Default project'}`}
                  </option>
                ))
              }
            </FormControl>
          </div>
        </FormGroup>
        {this.renderProject(selectedProject)}
      </div>
    );
  }
}

HearingFormStep5.propTypes = {
  projects: PropTypes.array,
  dispatch: PropTypes.func,
  language: PropTypes.string,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  intl: PropTypes.object,
};

const mapStateToProps = (state) => ({
  projects: ProjectsSelector.getProjects(state)
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
