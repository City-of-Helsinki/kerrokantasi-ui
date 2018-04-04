import React from 'react';
import PropTypes from 'prop-types';
import {uniqWith, isEqual, keys} from 'lodash';
import Icon from '../../utils/Icon';
import {localizedNotifyError} from '../../utils/notify';
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
  const duplicatedLanguages = [
    ...keys(phaseInfo.title),
    ...keys(phaseInfo.description),
    ...keys(phaseInfo.schedule)
  ];
  const languages = uniqWith(duplicatedLanguages, isEqual);
  return (
    <Row>
      <Col md={12}>
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
                              <FormattedMessage id={`${indexNumber + 1}`} />*
                            </InputGroup.Addon>
                            <FormControlOnChange
                              maxLength="30"
                              defaultValue={phaseInfo.title[usedLanguage]}
                              onBlur={(event) => {
                                onChange(phaseInfo.id, 'title', usedLanguage, event.target.value);
                              }}
                              type="text"
                            />
                          </InputGroup>
                        </div>
                        {
                          index === 0
                          ? (
                            <Button
                              onClick={() => {
                                if (phaseInfo.has_hearings) {
                                  localizedNotifyError('tryingToDeletePhaseWithHearings');
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
                          )
                          : <span className="pull-right add-label-button" />
                        }
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <ControlLabel><FormattedMessage id="phaseDuration"/></ControlLabel>
                    <FormControlOnChange
                      maxLength="30"
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
                      maxLength="80"
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
      </Col>
    </Row>
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
