import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Icon from '../../utils/Icon';
import {injectIntl, FormattedMessage} from 'react-intl';

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
              ? selectedProject.phases.map((phase, index) => (
                <div key={phase.name}>
                  <span>{index + 1}</span><span>{phase.schedule}</span>
                </div>))
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

HearingFormStep5.propTypes = {
  projects: PropTypes.array
};

HearingFormStep5.contextTypes = {
  language: PropTypes.string
};

const mapStateToProps = (state) => ({
  projects: state.hearingEditor.projects
});

const WrappedHearingFormStep5 = connect(mapStateToProps)(injectIntl(HearingFormStep5));

export default WrappedHearingFormStep5;
