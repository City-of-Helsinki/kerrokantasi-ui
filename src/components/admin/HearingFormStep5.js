// @flow

import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import type {AppState} from '../../types';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Icon from '../../utils/Icon';
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
import {fetchProjects} from '../../actions';

class HearingFormStep5 extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchProjects());
  }
  onChangeProject = (event) => {
    this.props.dispatch(changeProject({
      projectId: event.target.value,
      projectLists: this.props.projects
    }));
  }
  addPhase = () => {
    // create an empty project (JSON object with only empty id) in case no project was selected when adding phase
    this.props.dispatch(addPhase({
      id: uuid(),
      has_hearings: false,
      title: {
        en: ''
      },
      description: {
        en: ''
      },
      schedule: {
        en: ''
      }
    }));
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
  render() {
    const {projects, language, hearing} = this.props;
    const selectedProject = hearing.project;
    return (
      <div>
        <FormGroup controlId="projectLists">
          <ControlLabel><FormattedMessage id="project"/></ControlLabel>
          <div className="select">
            <FormControl
              componentClass="select"
              name="commenting"
              defaultValue={selectedProject.id}
              onChange={this.onChangeProject}
            >
              {
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {`${project.title[language] || project.title.en}`}
                  </option>
                ))
              }
            </FormControl>
          </div>
        </FormGroup>
        {
          Object.keys(selectedProject.title).map(usedLanguage => (
            <FormGroup controlId="projectName" key={usedLanguage}>
              <ControlLabel><FormattedMessage id="projectName"/> ({usedLanguage}) </ControlLabel>
              <FormControlOnChange
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
                />
              );
            })
          }
        </div>
        <ButtonToolbar>
          <Button
            onClick={this.addPhase}
            bsSize="small"
            bsStyle="default"
          >
            <Icon className="icon" name="plus"/> <FormattedMessage id="addProcess"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

HearingFormStep5.propTypes = {
  projects: PropTypes.array,
  dispatch: PropTypes.func,
  language: PropTypes.string,
  hearing: hearingShape
};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const mapStateToProps = (state: AppState) => ({
  projects: ProjectsSelector.getProjects(state)
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
