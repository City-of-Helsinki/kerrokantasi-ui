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
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import Phase from './Phase';
import {
  deletePhase,
  addPhase,
  fetchProjects,
  createProject,
  changePhase
} from '../../actions/hearingEditor';

class HearingFormStep5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProjectId: ''
    };
  }
  componentWillMount() {
    this.props.dispatch(fetchProjects());
  }
  onChange = (event) => {
    this.setState({
      selectedProjectId: event.target.value
    });
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
    }, this.state.selectedProjectId));
  }
  deletePhase = (phaseId) => {
    this.props.dispatch(deletePhase(phaseId, this.state.selectedProjectId));
  }
  onChangePhase = (phaseId, fieldName, language, value) => {
    this.props.dispatch(
      changePhase(phaseId, this.state.selectedProjectId, fieldName, language, value)
    );
  }
  renderPhases = (selectedProject) => {
    return selectedProject.phases.map((phase, index) => {
      const key = index;
      return (
        <Phase
          onChange={this.onChangePhase}
          phaseInfo={phase}
          key={key}
          indexNumber={index}
          onDelete={this.deletePhase}
        />
      );
    });
  }
  render() {
    const {projects, language} = this.props;
    const selectedProject = projects.filter(
      project => project.id === this.state.selectedProjectId
    )[0];
    return (
      <div>
        <FormGroup controlId="hearingCommenting">
          <ControlLabel><FormattedMessage id="project"/></ControlLabel>
          <div className="select">
            <FormControl
              componentClass="select"
              name="commenting"
              onChange={this.onChange}
            >
              {
                projects.map((project) => (
                  project.id === ''
                  ? <option key={project.id} value={project.id}>new project</option>
                  : (
                    <option key={project.id} value={project.id}>
                      {`project name: ${project.title[language] || project.title.en}`}
                    </option>
                    )
                ))
              }
            </FormControl>
          </div>
        </FormGroup>
        <div className="phases-container">
          {this.renderPhases(selectedProject)}
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
  language: PropTypes.string
};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const mapStateToProps = (state: AppState) => ({
  projects: HearingEditorSelector.getProjects(state)
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
