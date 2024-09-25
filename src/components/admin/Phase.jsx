/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Checkbox, IconTrash, TextInput } from 'hds-react';
import { useDispatch } from 'react-redux';

import { createNotificationPayload } from '../../utils/notify';
import { addToast } from '../../actions/toast';

const Phase = (props) => {
  const { phaseInfo, indexNumber, onDelete, onChange, onActive, languages, errors } = props;

  const dispatch = useDispatch();

  const handleRadioOnChange = (event) => {
    if (event.target.checked) {
      onActive(phaseInfo.id || phaseInfo.frontId);
    } else {
      onActive(null);
    }
  };

  return (
    <div>
      {languages.map((usedLanguage, index) => (
        <div key={usedLanguage}>
          <div>
            <div className='hearing-form-column' style={{ marginBottom: 'var(--spacing-s)' }}>
              <TextInput
                id={`phase-${indexNumber + 1}`}
                name={`phase-${indexNumber + 1}`}
                label={
                  <>
                    <FormattedMessage id='phase' /> {indexNumber + 1} ({usedLanguage})
                  </>
                }
                value={phaseInfo.title[usedLanguage]}
                maxLength={100}
                onBlur={(event) =>
                  onChange(phaseInfo.id || phaseInfo.frontId, 'title', usedLanguage, event.target.value)
                }
                invalid={!!errors.project_phase_title}
                errorText={errors.project_phase_title}
                required
              />
              {index === 0 ? (
                <Button
                  onClick={() => {
                    if (phaseInfo.has_hearings) {
                      dispatch(addToast(createNotificationPayload('error', 'tryingToDeletePhaseWithHearings')));
                    } else {
                      onDelete(phaseInfo.id || phaseInfo.frontId);
                    }
                  }}
                  size='small'
                  className='kerrokantasi-btn pull-right action-button'
                  style={{ color: 'red', borderColor: 'red' }}
                >
                  <IconTrash />
                </Button>
              ) : (
                <span className='pull-right action-button' />
              )}
            </div>
          </div>
          <div className='hearing-form-row'>
            <div className='hearing-form-column'>
              <TextInput
                id={`phase-duration-${indexNumber + 1}`}
                name={`phase-duration-${indexNumber + 1}`}
                label={<FormattedMessage id='phaseDuration' />}
                maxLength={50}
                value={phaseInfo.schedule[usedLanguage]}
                onBlur={(event) =>
                  onChange(phaseInfo.id || phaseInfo.frontId, 'schedule', usedLanguage, event.target.value)
                }
              />
            </div>
            <div className='hearing-form-column'>
              <TextInput
                id={`phase-description-${indexNumber + 1}`}
                name={`phase-description-${indexNumber + 1}`}
                label={<FormattedMessage id='phaseDescription' />}
                maxLength={100}
                value={phaseInfo.description[usedLanguage]}
                onBlur={(event) =>
                  onChange(phaseInfo.id || phaseInfo.frontId, 'description', usedLanguage, event.target.value)
                }
              />
            </div>
          </div>
          <div style={{ marginBottom: 'var(--spacing-m)' }}>
            {index === 0 && (
              <Checkbox
                id={`phase-active-${indexNumber + 1}`}
                name={`phase-active-${indexNumber + 1}`}
                label={<FormattedMessage id='phaseActive'>{(txt) => txt}</FormattedMessage>}
                onChange={handleRadioOnChange}
                checked={phaseInfo.is_active}
                errorText={errors.project_phase_active}
              />
            )}
          </div>
        </div>
      ))}
    </div>
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
