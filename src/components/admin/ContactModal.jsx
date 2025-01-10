/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React from 'react';
import { map, forEach, omit, isEmpty } from 'lodash';
import { ControlLabel, HelpBlock } from 'react-bootstrap';
import { Button, Dialog, Select } from 'hds-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import config from '../../config';
import { organizationShape } from '../../types';

class ContactModal extends React.Component {
  static initializeLanguages() {
    const titleLanguages = {};
    forEach(config.languages, (language) => {
      titleLanguages[language] = false;
    });
    return titleLanguages;
  }

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
        title: {},
      },
      titleLanguages: this.constructor.initializeLanguages(),
    };
  }

  componentDidMount() {
    const { contactInfo } = this.props;
    const {titleLanguages} = this.state
    this.setState({
      titleLanguages: { ...titleLanguages, fi: true },
      contact: {
        id: contactInfo.id || '',
        name: contactInfo.name || '',
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        title: contactInfo.title || {},
        organization: contactInfo.organization || '',
        additional_info: contactInfo.additional_info || '',
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contactInfo !== this.props.contactInfo || prevProps.organizations !== this.props.organizations) {
      const { contactInfo } = this.props;
      const newTitleLanguages = {};
      forEach(contactInfo.title, (title, language) => {
        newTitleLanguages[language] = !isEmpty(title);
      });
      this.setState({
        contact: {
          id: contactInfo.id || '',
          name: contactInfo.name || '',
          phone: contactInfo.phone || '',
          email: contactInfo.email || '',
          organization: contactInfo.organization || '',
          additional_info: contactInfo.additional_info || '',
          title: contactInfo.title || {},
        },
        titleLanguages: newTitleLanguages,
      });
    }
  }

  onContactChange(field, value) {
    this.setState((prevState) =>
      update(prevState, {
        contact: {
          [field]: {
            $set: value,
          },
        },
      }),
    );
  }

  onContactTitleChange(language, value) {
    this.setState((prevState) =>
      update(prevState, {
        contact: {
          title: {
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
        titleLanguages: {
          [language]: {
            $set: !prevState.titleLanguages[language],
          },
        },
      }),
    );
  }

  async submitForm(event) {
    event.preventDefault();
    let success = false;
    if (isEmpty(this.props.contactInfo)) {
      success = await this.props.onCreateContact(omit(this.state.contact, ['id']));
    } else {
      const omittedLanguages = [];
      forEach(this.state.titleLanguages, (value, key) => {
        if (!value) omittedLanguages.push(key);
      });
      const contactInfo = update(this.state.contact, {
        title: { $unset: omittedLanguages },
      });
      success = await this.props.onEditContact(contactInfo);
    }
    if (!success) return;
    // reset the state
    this.setState({
      contact: {
        id: '',
        name: '',
        phone: '',
        email: '',
        organization: '',
        additional_info: '',
        title: {},
      },
      titleLanguages: this.constructor.initializeLanguages(),
    });
    this.props.onClose();
  }

  generateCheckBoxes() {
    const checkBoxes = map(config.languages, (language) => (
      <div key={language} className='checkbox-container'>
        <FormattedMessage id={`inLanguage-${language}`} />
        <input
          type='checkbox'
          checked={this.state.titleLanguages[language]}
          onChange={() => this.onActiveLanguageChange(language)}
        />
      </div>
    ));
    return <div className='title-checkboxes'>{checkBoxes}</div>;
  }

  generateTitleInputs() {
    const { contact, titleLanguages } = this.state;
    const { intl } = this.props;
    const titleInputs = [];
    forEach(titleLanguages, (language, key) => {
      if (language) {
        titleInputs.push(
          <div key={key} className='title-input-container'>
            <ControlLabel>
              <FormattedMessage id={`inLanguage-${key}`} />
            </ControlLabel>
            <input
              className='form-control'
              onChange={(event) => this.onContactTitleChange(key, event.target.value)}
              value={contact.title[key] || ''}
              placeholder={intl.formatMessage({ id: 'contactTitlePlaceholder' })}
              maxLength='250'
            />
          </div>,
        );
      }
    });
    return <div className='title-inputs'>{titleInputs}</div>;
  }

  render() {
    const { isOpen, intl, onClose, contactInfo, organizations } = this.props;
    const { contact } = this.state;
    const checkBoxes = this.generateCheckBoxes();
    const titleInputs = this.generateTitleInputs();
    const isCreate = isEmpty(contactInfo);

    const titleId = 'contact-modal-title';
    const descriptionId = 'contact-modal-description';

    return (
      <Dialog
        className='hearing-form-child-modal'
        isOpen={isOpen}
        close={onClose}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        closeButtonLabelText={intl.formatMessage({ id: 'close' })}
        theme={{ '--accent-line-color': 'var(--color-black)' }}
      >
        <Dialog.Header
          id={titleId}
          title={isCreate ? <FormattedMessage id='createContact' /> : <FormattedMessage id='editContact' />}
        />
        <Dialog.Content>
          <form id={descriptionId} onSubmit={this.submitForm}>
            <div className='input-container name-input'>
              <h4>
                <FormattedMessage id='name' />
              </h4>
              <input
                className='form-control'
                onChange={(event) => this.onContactChange('name', event.target.value)}
                value={contact.name}
                placeholder='Nimi'
                maxLength='50'
                required
              />
            </div>
            <div className='input-container phone-input'>
              <h4>
                <FormattedMessage id='phone' />
              </h4>
              <input
                className='form-control'
                onChange={(event) => this.onContactChange('phone', event.target.value)}
                value={contact.phone}
                placeholder='Puhelinnumero'
                maxLength='50'
                required
              />
            </div>
            <div className='input-container email-input'>
              <h4>
                <FormattedMessage id='email' />
              </h4>
              <input
                type='email'
                className='form-control'
                onChange={(event) => this.onContactChange('email', event.target.value)}
                value={contact.email}
                placeholder='Sähköposti'
                maxLength='50'
                required
              />
            </div>
            <div className='input-container title-input'>
              <h4>
                <FormattedMessage id='contactTitle' />
              </h4>
              {checkBoxes}
              {titleInputs}
            </div>
            <div className='input-container'>
              <h4>
                <FormattedMessage id='organization' />
              </h4>
              <Select
                label='Organisaatio'
                placeholder='Organisaatio'
                onChange={(selected) => this.onContactChange('organization', selected.value)}
                options={organizations.map((org) => ({
                  label: `${org.name} ${org.external_organization ? '*' : ''}`,
                  value: org.name,
                }))}
                value={{ label: contact.organization, value: contact.organization }}
                isDisabled={!isEmpty(this.props.contactInfo)} // Enabled only when creating a contact
              />
              <HelpBlock>
                <FormattedMessage id='contactPersonOrganizationHelpText' />
              </HelpBlock>
            </div>
            <div className='input-container'>
              <h4>
                <FormattedMessage id='additionalInfo' />
              </h4>
              <input
                className='form-control'
                onChange={(event) => this.onContactChange('additional_info', event.target.value)}
                value={contact.additional_info}
                placeholder='Lisätiedot yhteyshenkilöstä'
                maxLength='50'
              />
              <HelpBlock>
                <FormattedMessage id='contactPersonAdditionalInfoHelpText' />
              </HelpBlock>
            </div>
            <input type='submit' style={{ display: 'none' }} /> {/* Used to trigger submit remotely. */}
          </form>
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button className='kerrokantasi-btn black' onClick={this.submitForm}>
            {isCreate ? <FormattedMessage id='create' /> : <FormattedMessage id='save' />}
          </Button>
          <Button className='kerrokantasi-btn' onClick={onClose}>
            <FormattedMessage id='cancel' />
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
    );
  }
}

ContactModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateContact: PropTypes.func,
  onEditContact: PropTypes.func,
  contactInfo: PropTypes.object,
  organizations: PropTypes.arrayOf(organizationShape),
  intl: PropTypes.object,
};

export default injectIntl(ContactModal);
