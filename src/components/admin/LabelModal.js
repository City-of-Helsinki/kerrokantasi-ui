import React from 'react';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import {Modal, Button, ControlLabel} from 'react-bootstrap';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import config from '../../config';

class LabelModal extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      label: {
        label: {}
      },
      labelLanguages: this.constructor.initializeLanguages()
    };
  }

  static initializeLanguages() {
    const labelLanguages = {};
    forEach(config.languages, (language) => {
      labelLanguages[language] = false;
    });
    return labelLanguages;
  }

  componentWillMount() {
    this.setState(update(this.state, { labelLanguages: { fi: { $set: true }}}));
  }

  onLabelChange(language, value) {
    this.setState(update(this.state, {
      label: {
        label: {
          [language]: {
            $set: value
          }
        }
      }
    }));
  }

  onActiveLanguageChange(language) {
    this.setState(update(this.state, {
      labelLanguages: {
        [language]: {
          $set: !this.state.labelLanguages[language]
        }
      }
    }));
  }

  submitForm(event) {
    event.preventDefault();
    this.props.onCreateLabel(this.state.label);
    this.props.onClose();
  }

  generateCheckBoxes() {
    const checkBoxes = map(config.languages, (language) => (
      <div key={language} className="checkbox-container">
        <FormattedMessage id={`inLanguage-${language}`}/>
        <input
          type="checkbox"
          checked={this.state.labelLanguages[language]}
          onChange={() => this.onActiveLanguageChange(language)}
        />
      </div>
    ));
    return <div className="label-checkboxes">{checkBoxes}</div>;
  }

  generateLabelInputs() {
    const { label, labelLanguages } = this.state;
    const { intl } = this.props;
    const labelInputs = [];

    forEach(labelLanguages, (language, key) => {
      if (language) {
        labelInputs.push(
          <div key={key} className="label-input-container">
            <ControlLabel>
              <FormattedMessage id={`inLanguage-${key}`}/>
            </ControlLabel>
            <input
              className="form-control"
              onChange={(event) => this.onLabelChange(key, event.target.value)}
              value={label.label[key] || ''}
              placeholder={intl.formatMessage({ id: 'labelPlaceholder' })}
              maxLength="200"
            />
          </div>
        );
      }
    });
    return <div className="label-inputs">{labelInputs}</div>;
  }

  render() {
    const { isOpen, onClose } = this.props;
    const checkBoxes = this.generateCheckBoxes();
    const labelInputs = this.generateLabelInputs();

    return (
      <Modal className="label-modal" show={isOpen} onHide={() => onClose()} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="createLabel"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form ref={(form) => { this.labelForm = form; }} onSubmit={this.submitForm}>
            <div className="input-container label-input">
              {checkBoxes}
              {labelInputs}
            </div>
            <input type="submit" style={{ display: 'none'}} /> {/* Used to trigger submit remotely. */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onClose()}>
            <FormattedMessage id="cancel"/>
          </Button>
          <Button bsStyle="primary" onClick={() => this.labelForm.querySelector('input[type="submit"]').click()}>
            <FormattedMessage id="create"/>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

LabelModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateLabel: PropTypes.func
};

export default injectIntl(LabelModal);
