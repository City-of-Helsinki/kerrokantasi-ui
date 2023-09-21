import React from 'react';
import {map, forEach, omit, isEmpty} from 'lodash';
import {Modal, ControlLabel, HelpBlock} from 'react-bootstrap';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import config from '../../config';
import {organizationShape} from "../../types";
import Select from "react-select";

class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      contact: {
        id: '',
        name: '',
        phone: '',
        email: '',
        organization: '',
        additional_info: '',
        title: {}
      },
      titleLanguages: this.constructor.initializeLanguages(),
      organizations: [],
    };
  }

  static initializeLanguages() {
    const titleLanguages = {};
    forEach(config.languages, (language) => {
      titleLanguages[language] = false;
    });
    return titleLanguages;
  }

  componentWillReceiveProps(nextProps) {
    const {contactInfo} = nextProps;
    const newTitleLanguages = {};
    forEach(contactInfo.title, (title, language) => {
      newTitleLanguages[language] = !isEmpty(title);
    });
    this.setState(update(this.state, {
      contact: {
        id: { $set: contactInfo.id || '' },
        name: { $set: contactInfo.name || '' },
        phone: { $set: contactInfo.phone || '' },
        email: { $set: contactInfo.email || '' },
        organization: { $set: contactInfo.organization || '' },
        additional_info: { $set: contactInfo.additional_info || '' },
        title: { $set: contactInfo.title || {} },
      },
      titleLanguages: { $set: newTitleLanguages }
    }));
  }

  componentWillMount() {
    const {contactInfo, organizations} = this.props;
    this.setState(update(this.state, {
      titleLanguages: { fi: { $set: true }},
      contact: {
        name: { $set: contactInfo.name || '' },
        phone: { $set: contactInfo.phone || '' },
        email: { $set: contactInfo.email || '' },
        title: { $set: contactInfo.title || {} },
        organization: { $set: contactInfo.organization || '' },
        additional_info: { $set: contactInfo.additional_info || '' },
      },
      organizations: { $set: organizations },
    }));
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
    if (isEmpty(this.props.contactInfo)) {
      this.props.onCreateContact(omit(this.state.contact, ['id']));
    } else {
      const omittedLanguages = [];
      forEach(this.state.titleLanguages, (value, key) => {
        if (!value) omittedLanguages.push(key);
      });
      const contactInfo = update(this.state.contact, {
        title: { $unset: omittedLanguages }
      });
      this.props.onEditContact(contactInfo);
    }
    // reset the state
    this.setState({
      contact: {
        id: '',
        name: '',
        phone: '',
        email: '',
        organization: '',
        additional_info: '',
        title: {}
      },
      titleLanguages: this.constructor.initializeLanguages()
    });
    this.props.onClose();
  }

  generateCheckBoxes() {
    const checkBoxes = map(config.languages, (language) => (
      <div key={language} className="checkbox-container">
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
            <ControlLabel>
              <FormattedMessage id={`inLanguage-${key}`}/>
            </ControlLabel>
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
    const { isOpen, onClose, contactInfo, organizations } = this.props;
    const { contact } = this.state;
    const checkBoxes = this.generateCheckBoxes();
    const titleInputs = this.generateTitleInputs();
    const isCreate = isEmpty(contactInfo);

    return (
      <Modal className="contact-modal" show={isOpen} onHide={() => onClose()} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            { isCreate ? <FormattedMessage id="createContact"/> : <FormattedMessage id="editContact"/> }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form ref={(form) => { this.contactForm = form; }} onSubmit={this.submitForm}>
            <div className="input-container name-input">
              <h4><FormattedMessage id="name"/></h4>
              <input
                className="form-control"
                onChange={(event) => this.onContactChange('name', event.target.value)}
                value={contact.name}
                placeholder="Nimi"
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
                placeholder="Puhelinnumero"
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
                placeholder="Sähköposti"
                maxLength="50"
                required
              />
            </div>
            <div className="input-container title-input">
              <h4><FormattedMessage id="contactTitle"/></h4>
              {checkBoxes}
              {titleInputs}
            </div>
            <div className="input-container">
              <h4><FormattedMessage id="organization"/></h4>
              <Select
                labelKey="Organisaatio"
                name="Organisaatio"
                placeholder="Organisaatio"
                valueKey="name"
                onChange={(value) => this.onContactChange('organization', value.name)}
                options={organizations}
                optionRenderer={(option) => <span>{option.name} {option.external_organization ? "*" : ""}</span>}
                valueRenderer={(option) => <span>{option.name}</span>}
                value={contact.organization}
                disabled={!isEmpty(this.props.contactInfo)} // Enabled only when creating a contact
              />
              <HelpBlock><FormattedMessage id="contactPersonOrganizationHelpText"/></HelpBlock>
            </div>
            <div className="input-container">
              <h4><FormattedMessage id="additionalInfo"/></h4>
              <input
                className="form-control"
                onChange={(event) => this.onContactChange('additional_info', event.target.value)}
                value={contact.additional_info}
                placeholder="Lisätiedot yhteyshenkilöstä"
                maxLength="50"
              />
              <HelpBlock><FormattedMessage id="contactPersonAdditionalInfoHelpText"/></HelpBlock>
            </div>
            <input type="submit" style={{ display: 'none'}} /> {/* Used to trigger submit remotely. */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onClose()}>
            <FormattedMessage id="cancel"/>
          </Button>
          <Button bsStyle="primary" onClick={() => this.contactForm.querySelector('input[type="submit"]').click()}>
            { isCreate ? <FormattedMessage id="create"/> : <FormattedMessage id="save" /> }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ContactModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateContact: PropTypes.func,
  onEditContact: PropTypes.func,
  contactInfo: PropTypes.object,
  organizations: PropTypes.arrayOf(organizationShape),
};

export default injectIntl(ContactModal);
