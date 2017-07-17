import React from 'react';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import {Modal, Button} from 'react-bootstrap';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import update from 'immutability-helper';

import config from '../../config';

class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      contact: {
        name: '',
        phone: '',
        email: '',
        title: {}
      },
      titleLanguages: this.constructor.initializeLanguages()
    };
  }

  static initializeLanguages() {
    const titleLanguages = {};
    forEach(config.languages, (language) => {
      titleLanguages[language] = false;
    });
    return titleLanguages;
  }

  componentWillMount() {
    this.setState(update(this.state, { titleLanguages: { fi: { $set: true }}}));
  }

  onContactChange(field, value) {
    this.setState(update(this.state, {
      contact: {
        [field]: {
          $set: value
        }
      }
    }));
  }

  onContactTitleChange(language, value) {
    this.setState(update(this.state, {
      contact: {
        title: {
          [language]: {
            $set: value
          }
        }
      }
    }));
  }

  onActiveLanguageChange(language) {
    this.setState(update(this.state, {
      titleLanguages: {
        [language]: {
          $set: !this.state.titleLanguages[language]
        }
      }
    }));
  }

  submitForm(event) {
    event.preventDefault();
    this.props.onCreateContact(this.state.contact);
    this.props.onClose();
  }

  generateCheckBoxes() {
    const checkBoxes = map(config.languages, (language) => (
      <div key={language} className={'checkbox-container'}>
        <FormattedMessage id={`inLanguage-${language}`}/>
        <input
          type="checkbox"
          checked={this.state.titleLanguages[language]}
          onChange={() => this.onActiveLanguageChange(language)}
        />
      </div>
    ));
    return <div className="title-checkboxes">{checkBoxes}</div>;
  }

  generateTitleInputs() {
    const { contact, titleLanguages } = this.state;
    const { intl } = this.props;
    const titleInputs = [];

    forEach(titleLanguages, (language, key) => {
      if (language) {
        titleInputs.push(
          <div key={key} className="title-input-container">
            <FormattedMessage id={`inLanguage-${key}`}/>
            <input
              className="form-control"
              onChange={(event) => this.onContactTitleChange(key, event.target.value)}
              value={contact.title[key] || ''}
              placeholder={intl.formatMessage({ id: 'contactTitlePlaceholder' })}
              maxLength="250"
            />
          </div>
        );
      }
    });
    return <div className="title-inputs">{titleInputs}</div>;
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { contact } = this.state;
    const checkBoxes = this.generateCheckBoxes();
    const titleInputs = this.generateTitleInputs();

    return (
      <Modal className="contact-modal" show={isOpen} onHide={() => onClose()} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="createContact"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form ref={(form) => { this.contactForm = form; }} onSubmit={this.submitForm}>
            <div className="input-container name-input">
              <h4><FormattedMessage id="name"/></h4>
              <input
                className="form-control"
                onChange={(event) => this.onContactChange('name', event.target.value)}
                value={contact.name}
                placeholder={'Nimi'}
                maxLength="50"
                required
              />
            </div>
            <div className="input-container phone-input">
              <h4><FormattedMessage id="phone"/></h4>
              <input
                className="form-control"
                onChange={(event) => this.onContactChange('phone', event.target.value)}
                value={contact.phone}
                placeholder={'Puhelinnumero'}
                maxLength="50"
                required
              />
            </div>
            <div className="input-container email-input">
              <h4><FormattedMessage id="email"/></h4>
              <input
                type="email"
                className="form-control"
                onChange={(event) => this.onContactChange('email', event.target.value)}
                value={contact.email}
                placeholder={'Sähköposti'}
                maxLength="50"
                required
              />
            </div>
            <div className="input-container title-input">
              <h4><FormattedMessage id="contactTitle"/></h4>
              {checkBoxes}
              {titleInputs}
            </div>
            <input type="submit" style={{ display: 'none'}} /> {/* Used to trigger submit remotely. */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onClose()}>
            <FormattedMessage id="cancel"/>
          </Button>
          <Button bsStyle="primary" onClick={() => this.contactForm.querySelector('input[type="submit"]').click()}>
            <FormattedMessage id="create"/>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ContactModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onCreateContact: React.PropTypes.func
};

export default injectIntl(ContactModal);
