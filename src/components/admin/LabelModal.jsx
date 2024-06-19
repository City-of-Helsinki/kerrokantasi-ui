/* eslint-disable camelcase */
import React from 'react';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { ControlLabel } from 'react-bootstrap';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { Button, Dialog } from 'hds-react';

import config from '../../config';

class LabelModal extends React.Component {
  static initializeLanguages() {
    const labelLanguages = {};
    forEach(config.languages, (language) => {
      labelLanguages[language] = false;
    });
    return labelLanguages;
  }

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      label: {
        label: {},
      },
      labelLanguages: this.constructor.initializeLanguages(),
    };
  }

  UNSAFE_componentWillMount() {
    this.setState((prevState) => update(prevState, { labelLanguages: { fi: { $set: true } } }));
  }

  onLabelChange(language, value) {
    this.setState((prevState) =>
      update(prevState, {
        label: {
          label: {
            [language]: {
              $set: value,
            },
          },
        },
      }),
    );
  }

  onActiveLanguageChange(language) {
    this.setState((prevState) =>
      update(prevState, {
        labelLanguages: {
          [language]: {
            $set: !prevState.labelLanguages[language],
          },
        },
      }),
    );
  }

  submitForm(event) {
    event.preventDefault();
    this.props.onCreateLabel(this.state.label);
    this.props.onClose();
  }

  generateCheckBoxes() {
    const checkBoxes = map(config.languages, (language) => (
      <div key={language} className='checkbox-container'>
        <FormattedMessage id={`inLanguage-${language}`} />
        <input
          type='checkbox'
          checked={this.state.labelLanguages[language]}
          onChange={() => this.onActiveLanguageChange(language)}
        />
      </div>
    ));
    return <div className='label-checkboxes'>{checkBoxes}</div>;
  }

  generateLabelInputs() {
    const { label, labelLanguages } = this.state;
    const { intl } = this.props;
    const labelInputs = [];

    forEach(labelLanguages, (language, key) => {
      if (language) {
        labelInputs.push(
          <div key={key} className='label-input-container'>
            <ControlLabel>
              <FormattedMessage id={`inLanguage-${key}`} />
            </ControlLabel>
            <input
              className='form-control'
              onChange={(event) => this.onLabelChange(key, event.target.value)}
              value={label.label[key] || ''}
              placeholder={intl.formatMessage({ id: 'labelPlaceholder' })}
              maxLength='200'
            />
          </div>,
        );
      }
    });
    return <div className='label-inputs'>{labelInputs}</div>;
  }

  render() {
    const { isOpen, intl, onClose } = this.props;
    const checkBoxes = this.generateCheckBoxes();
    const labelInputs = this.generateLabelInputs();

    const titleId = 'label-modal-title';
    const descriptionId = 'label-modal-description';

    return (
      <Dialog
        className='hearing-form-child-modal'
        isOpen={isOpen}
        close={onClose}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        closeButtonLabelText={intl.formatMessage({ id: 'close' })}
      >
        <Dialog.Header id={titleId} title={<FormattedMessage id='createLabel' />} />
        <Dialog.Content>
          <form
            id={descriptionId}
            ref={(form) => {
              this.labelForm = form;
            }}
            onSubmit={this.submitForm}
          >
            <div className='input-container label-input'>
              {checkBoxes}
              {labelInputs}
            </div>
            <input type='submit' style={{ display: 'none' }} /> {/* Used to trigger submit remotely. */}
          </form>
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button onClick={onClose}>
            <FormattedMessage id='cancel' />
          </Button>
          <Button
            className='kerrokantasi-btn'
            onClick={() => this.labelForm.querySelector('input[type="submit"]').click()}
          >
            <FormattedMessage id='create' />
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
    );
  }
}

LabelModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateLabel: PropTypes.func,
};

export default injectIntl(LabelModal);
