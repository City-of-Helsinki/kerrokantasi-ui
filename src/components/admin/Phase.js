import React from 'react';
import PropTypes from 'prop-types';
import {toast, style} from 'react-toastify';
import Icon from '../../utils/Icon';
import Radio from 'react-bootstrap/lib/Radio';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import {Row, Col} from 'react-bootstrap';
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControlOnChange from '../forms/FormControlOnChange';

const Phase = (props) => {
  const {phaseInfo, indexNumber, onDelete, onChange, onActive} = props;
  const languages = Object.keys(phaseInfo.title);
  return (
    <div>
      {
        languages.map((usedLanguage, index) => (
          <FormGroup key={usedLanguage}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <ControlLabel>
                    <FormattedMessage id="phase"/> {indexNumber + 1} ({usedLanguage})
                  </ControlLabel>
                  <div className="label-elements">
                    <div>
                      <InputGroup>
                        <InputGroup.Addon>
                          <FormattedMessage id={`${indexNumber + 1}`} />
                        </InputGroup.Addon>
                        <FormControlOnChange
                          defaultValue={phaseInfo.title[usedLanguage]}
                          onBlur={(event) => {
                            onChange(phaseInfo.id, 'title', usedLanguage, event.target.value);
                          }}
                          type="text"
                        />
                      </InputGroup>
                    </div>
                    <Button
                      onClick={() => {
                        if (phaseInfo.has_hearings) {
                          toast.error("Can't delete phase with hearings", {position: toast.POSITION.BOTTOM_RIGHT});
                        } else {
                          onDelete(phaseInfo.id);
                        }
                      }}
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
                <ControlLabel><FormattedMessage id="phaseDuration"/></ControlLabel>
                <FormControlOnChange
                  defaultValue={phaseInfo.schedule[usedLanguage]}
                  onBlur={(event) => {
                    onChange(phaseInfo.id, 'schedule', usedLanguage, event.target.value);
                  }}
                  type="text"
                />
              </Col>
              <Col md={6}>
                <ControlLabel><FormattedMessage id="phaseDescription"/></ControlLabel>
                <FormControlOnChange
                  defaultValue={phaseInfo.description[usedLanguage]}
                  onBlur={(event) => {
                    onChange(phaseInfo.id, 'description', usedLanguage, event.target.value);
                  }}
                  type="text"
                />
              </Col>
            </Row>
            {
              index === 0
              ? (
                <Row>
                  <Col md={12}>
                    <Radio onChange={() => onActive(phaseInfo.id)} checked={phaseInfo.is_active}>
                      <FormattedMessage id="phaseActive"/>
                    </Radio>
                  </Col>
                </Row>
              )
              : null
            }
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
  onChange: PropTypes.func,
  onActive: PropTypes.func
};

Phase.contextTypes = {
  language: PropTypes.string
};

const WrappedPhase = injectIntl(Phase);

export default WrappedPhase;
