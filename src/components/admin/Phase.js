import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../utils/Icon';
import Radio from 'react-bootstrap/lib/Radio';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import {Row, Col} from 'react-bootstrap';
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

const Phase = (props) => {
  const {phaseInfo, indexNumber, onDelete, onChange} = props;
  const languages = Object.keys(phaseInfo.title);
  return (
    <div>
      {
        languages.map(usedLanguage => (
          <FormGroup key={usedLanguage}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <ControlLabel>Step {indexNumber + 1} ({usedLanguage})</ControlLabel>
                  <div className="label-elements">
                    <div>
                      <InputGroup>
                        <InputGroup.Addon>
                          <FormattedMessage id={`${indexNumber + 1}`}>{indexNumber + 1}</FormattedMessage>
                        </InputGroup.Addon>
                        <FormControl
                          onChange={(event) => {
                            onChange(phaseInfo.id, 'title', usedLanguage, event.target.value);
                          }}
                          type="text"
                          value={phaseInfo.title[usedLanguage]}
                        />
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
                <FormControl
                  onChange={(event) => {
                    onChange(phaseInfo.id, 'schedule', usedLanguage, event.target.value);
                  }}
                  type="text"
                  value={phaseInfo.schedule[usedLanguage]}
                />
              </Col>
              <Col md={6}>
                <ControlLabel>description</ControlLabel>
                <FormControl
                  onChange={(event) => {
                    onChange(phaseInfo.id, 'description', usedLanguage, event.target.value);
                  }}
                  type="text"
                  value={phaseInfo.description[usedLanguage]}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Radio>active</Radio>
              </Col>
            </Row>
          </FormGroup>
        ))
      }
    </div>
  );
};

Phase.propTypes = {
  phaseInfo: PropTypes.object.isRequired,
  indexNumber: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

Phase.contextTypes = {
  language: PropTypes.string
};

const WrappedPhase = injectIntl(Phase);

export default WrappedPhase;
