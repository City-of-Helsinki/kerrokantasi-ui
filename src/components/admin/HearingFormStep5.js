// @flow

import React from 'react';
import PropTypes from 'prop-types';
import updeep from 'updeep';
import uuid from 'uuid/v1';
import type {AppState} from '../../types';
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
      const emptyPhase = hearingLanguages.reduce((accumulator, current) => {
        return updeep({
          title: {[current]: ''},
          description: {[current]: ''},
          schedule: {[current]: ''},
        }, accumulator);
      }, {
        frontId: uuid(),
        has_hearings: false,
        is_active: false,
        title: {},
        description: {},
        schedule: {}
      });
      // create an empty project (JSON object with only empty id) in case no project was selected when adding phase
      return this.props.dispatch(addPhase(emptyPhase));
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
              value={selectedProject.id}
              onChange={this.onChangeProject}
            >
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
        {
          Object.keys(selectedProject.title).map(usedLanguage => (
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
  hearing: hearingShape,
  hearingLanguages: PropTypes.array
};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const mapStateToProps = (state: AppState) => ({
  projects: ProjectsSelector.getProjects(state)
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
