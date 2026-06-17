import { useRef, useState } from 'react';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { useIntl, FormattedMessage } from 'react-intl';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { Button, Dialog } from 'hds-react';

import config from '../../config';

function initializeLanguages() {
  const labelLanguages = {};
  forEach(config.languages, (language) => {
    labelLanguages[language] = language === 'fi';
  });
  return labelLanguages;
}

const LabelModal = ({ isOpen, onClose, onCreateLabel }) => {
  const intl = useIntl();
  const labelFormRef = useRef(null);
  const [label, setLabel] = useState({ label: {} });
  const [labelLanguages, setLabelLanguages] = useState(initializeLanguages);

  const onLabelChange = (language, value) => {
    setLabel((prev) =>
      update(prev, {
        label: { [language]: { $set: value } },
      })
    );
  };

  const onActiveLanguageChange = (language) => {
    setLabelLanguages((prev) =>
      update(prev, {
        [language]: { $set: !prev[language] },
      })
    );
  };

  const closeFn = () => {
    setLabel({ label: {} });
    setLabelLanguages(initializeLanguages());
    onClose();
  };

  const submitForm = (event) => {
    event.preventDefault();
    onCreateLabel(label);
    closeFn();
  };

  const checkBoxes = map(config.languages, (language) => (
    <div key={language} className='checkbox-container'>
      <FormattedMessage id={`inLanguage-${language}`} />
      <input
        type='checkbox'
        checked={labelLanguages[language]}
        onChange={() => onActiveLanguageChange(language)}
      />
    </div>
  ));

  const labelInputs = [];
  forEach(labelLanguages, (active, key) => {
    if (active) {
      labelInputs.push(
        <div key={key} className='label-input-container'>
          <label className='form-label' htmlFor={`label-input-${key}`}>
            <FormattedMessage id={`inLanguage-${key}`} />
          </label>
          <input
            id={`label-input-${key}`}
            className='form-control'
            onChange={(event) => onLabelChange(key, event.target.value)}
            value={label.label[key] || ''}
            placeholder={intl.formatMessage({ id: 'labelPlaceholder' })}
            maxLength='200'
          />
        </div>
      );
    }
  });

  const titleId = 'label-modal-title';
  const descriptionId = 'label-modal-description';

  return (
    <Dialog
      className='hearing-form-child-modal'
      isOpen={isOpen}
      close={closeFn}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={intl.formatMessage({ id: 'close' })}
      theme={{ '--accent-line-color': 'var(--color-black)' }}
    >
      <Dialog.Header
        id={titleId}
        title={<FormattedMessage id='createLabel' />}
      />
      <Dialog.Content>
        <form id={descriptionId} ref={labelFormRef} onSubmit={submitForm}>
          <div className='input-container label-input'>
            <div className='label-checkboxes'>{checkBoxes}</div>
            <div className='label-inputs'>{labelInputs}</div>
          </div>
          <input type='submit' style={{ display: 'none' }} />{' '}
          {/* Used to trigger submit remotely. */}
        </form>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button
          className='kerrokantasi-btn black'
          onClick={() =>
            labelFormRef.current.querySelector('input[type="submit"]').click()
          }
        >
          <FormattedMessage id='create' />
        </Button>
        <Button className='kerrokantasi-btn' onClick={closeFn}>
          <FormattedMessage id='cancel' />
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

LabelModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateLabel: PropTypes.func,
};

export default LabelModal;
