/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Radio from 'react-bootstrap/lib/Radio';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import { Row, Col } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button } from 'hds-react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

import { getValidationState } from '../../utils/hearingEditor';
import { localizedNotifyError } from '../../utils/notify';
import Icon from '../../utils/Icon';
import FormControlOnChange from '../forms/FormControlOnChange';

const Phase = (props) => {
  const { phaseInfo, indexNumber, onDelete, onChange, onActive, languages, errors } = props;

  const handleRadioOnChange = () => {
    onActive(phaseInfo.id || phaseInfo.frontId);
  };

  return (
    <Row>
      <Col md={12}>
        {languages.map((usedLanguage, index) => (
          <FormGroup key={usedLanguage}>
            <Row>
              <Col md={12}>
                <FormGroup validationState={getValidationState(errors, 'project_phase_title')}>
                  <ControlLabel>
                    <FormattedMessage id='phase' /> {indexNumber + 1} ({usedLanguage})
                  </ControlLabel>
                  <div className='label-elements'>
                    <div>
                      <InputGroup>
                        <InputGroup.Addon>
                          <FormattedMessage id={`${indexNumber + 1}`} />*
                        </InputGroup.Addon>
                        <FormControlOnChange
                          maxLength='100'
                          defaultValue={phaseInfo.title[usedLanguage]}
                          onBlur={(event) => {
                            onChange(phaseInfo.id || phaseInfo.frontId, 'title', usedLanguage, event.target.value);
                          }}
                          type='text'
                        />
                      </InputGroup>
                    </div>
                    {index === 0 ? (
                      <Button
                        onClick={() => {
                          if (phaseInfo.has_hearings) {
                            localizedNotifyError('tryingToDeletePhaseWithHearings');
                          } else {
                            onDelete(phaseInfo.id || phaseInfo.frontId);
                          }
                        }}
                        size="small"
                        className='kerrokantasi-btn pull-right add-label-button'
                        style={{ color: 'red', borderColor: 'red' }}
                      >
                        <Icon className='icon' name='trash' />
                      </Button>
                    ) : (
                      <span className='pull-right add-label-button' />
                    )}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <ControlLabel>
                  <FormattedMessage id='phaseDuration' />
                </ControlLabel>
                <FormControlOnChange
                  maxLength='50'
                  defaultValue={phaseInfo.schedule[usedLanguage]}
                  onBlur={(event) => {
                    onChange(phaseInfo.id || phaseInfo.frontId, 'schedule', usedLanguage, event.target.value);
                  }}
                  type='text'
                />
              </Col>
              <Col md={6}>
                <ControlLabel>
                  <FormattedMessage id='phaseDescription' />
                </ControlLabel>
                <FormControlOnChange
                  maxLength='100'
                  defaultValue={phaseInfo.description[usedLanguage]}
                  onBlur={(event) => {
                    onChange(phaseInfo.id || phaseInfo.frontId, 'description', usedLanguage, event.target.value);
                  }}
                  type='text'
                />
              </Col>
            </Row>
            {index === 0 ? (
              <Row>
                <Col md={12}>
                  <Radio
                    className={getValidationState(errors, 'project_phase_active') ? 'has-error' : ''}
                    onChange={handleRadioOnChange}
                    checked={phaseInfo.is_active || false}
                  >
                    <FormattedMessage id='phaseActive'>{(txt) => txt}</FormattedMessage>
                  </Radio>
                </Col>
              </Row>
            ) : null}
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
};

Phase.propTypes = {
  phaseInfo: PropTypes.object.isRequired,
  indexNumber: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  onActive: PropTypes.func,
  languages: PropTypes.arrayOf(PropTypes.string),
  errors: PropTypes.object,
};

const WrappedPhase = injectIntl(Phase);

export default WrappedPhase;
