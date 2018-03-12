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
import Radio from 'react-bootstrap/lib/Radio';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import {Row, Col} from 'react-bootstrap';
import Icon from '../../utils/Icon';
import {injectIntl, FormattedMessage} from 'react-intl';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import {deletePhase, addPhase, fetchProjects, createProject} from '../../actions/hearingEditor';

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
      name: '',
      schedule: '',
      description: '',
      hearings: []
    }, this.state.selectedProjectId));
  }
  deletePhase = (phaseId) => {
    this.props.dispatch(deletePhase(phaseId, this.state.selectedProjectId));
  }
  render() {
    const {projects} = this.props;
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
              {/* <option key="initial-value" value="" /> */}
              {
                projects.map((project) => (
                  project.id === ''
                  ? <option key={project.id} value={project.id}>new project</option>
                  : <option key={project.id} value={project.id}>{`project id: ${project.id}`}</option>
                ))
              }
            </FormControl>
          </div>
        </FormGroup>
        <div className="phases-container">
          {
            selectedProject
              ? selectedProject.phases.map((phase, index) => {
                const key = index;
                return (
                  <Phase
                    phaseInfo={phase}
                    key={key}
                    indexNumber={index}
                    onDelete={this.deletePhase}
                  />
                );
              }
              )
              : null
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

const Phase = (props) => {
  const {phaseInfo, indexNumber, onDelete} = props;
  return (
    <FormGroup>
      <Row>
        <Col md={12}>
          <FormGroup>
            <ControlLabel>Step {indexNumber + 1}</ControlLabel>
            <div className="label-elements">
              <div>
                <InputGroup>
                  <InputGroup.Addon>
                    <FormattedMessage id={`${indexNumber + 1}`}>{indexNumber + 1}</FormattedMessage>
                  </InputGroup.Addon>
                  <FormControl type="text" defaultValue={phaseInfo.name}/>
                </InputGroup>
              </div>
              <Button
                onClick={() => onDelete(phaseInfo.id)}
                bsStyle="default"
                className="pull-right add-label-button"
                style={{color: 'red', borderColor: 'red'}}
              >
                <Icon className="icon" name="trash"/>
              </Button>
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <ControlLabel>start time</ControlLabel>
          <FormControl type="text" defaultValue={phaseInfo.schedule}/>
        </Col>
        <Col md={6}>
          <ControlLabel>description</ControlLabel>
          <FormControl type="text" defaultValue={phaseInfo.description}/>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Radio>active</Radio>
        </Col>
      </Row>
    </FormGroup>
  );
};

Phase.propTypes = {
  phaseInfo: PropTypes.object.isRequired,
  indexNumber: PropTypes.number.isRequired,
  onDelete: PropTypes.func
};

HearingFormStep5.propTypes = {
  projects: PropTypes.array,
  dispatch: PropTypes.func
};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const mapStateToProps = (state: AppState) => ({
  projects: HearingEditorSelector.getProjects(state)
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
