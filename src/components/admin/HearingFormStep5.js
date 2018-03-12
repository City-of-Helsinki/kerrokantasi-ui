// @flow

import React from 'react';
import PropTypes from 'prop-types';
import type {AppState} from '../../types';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Radio from 'react-bootstrap/lib/Radio';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import {Grid, Row, Col} from 'react-bootstrap';
import Icon from '../../utils/Icon';
import {injectIntl, FormattedMessage} from 'react-intl';
import * as HearingEditorSelector from '../../selectors/hearingEditor';

class HearingFormStep5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProjectId: ''
    };
  }
  onChange = (event) => {
    this.setState({
      selectedProjectId: event.target.value
    });
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
              <option key="initial-value" value="" />
              {
                projects.map((project) => (
                  <option key={project.id} value={project.id}>{`project id: ${project.id}`}</option>
                ))
              }
            </FormControl>
          </div>
        </FormGroup>
        <div className="phases-container">
          {
            selectedProject
              ? selectedProject.phases.map((phase, index) =>
                <Phase
                  phaseInfo={phase}
                  key={phase.name}
                  indexNumber={index + 1}
                />
              )
              : null
          }
        </div>
        <ButtonToolbar>
          <Button
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
  const {phaseInfo, indexNumber} = props;
  return (
    <FormGroup>
      <Row>
        <Col md={12}>
          <FormGroup>
            <ControlLabel>Step {indexNumber}</ControlLabel>
            <div className="label-elements">
              <div>
                <InputGroup>
                  <InputGroup.Addon>
                    <FormattedMessage id={indexNumber}>{indexNumber}</FormattedMessage>
                  </InputGroup.Addon>
                  <FormControl type="text" defaultValue={phaseInfo.name}/>
                </InputGroup>
              </div>
              <Button bsStyle="primary" className="pull-right add-label-button">
                <Icon className="icon" name="plus"/>
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
          <ControlLabel>end time</ControlLabel>
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
  indexNumber: PropTypes.number.isRequired
};

HearingFormStep5.propTypes = {
  projects: PropTypes.array
};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const mapStateToProps = (state: AppState) => ({
  projects: HearingEditorSelector.getProjects(state)
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
