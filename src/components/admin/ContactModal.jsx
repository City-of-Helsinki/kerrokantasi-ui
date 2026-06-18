import { useEffect, useRef, useState } from 'react';
import { map, forEach, omit, isEmpty } from 'lodash';
import { Button, Dialog, Select } from 'hds-react';
import { useIntl, FormattedMessage } from 'react-intl';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import config from '../../config';
import { organizationShape } from '../../types';

function initializeLanguages() {
  const titleLanguages = {};
  forEach(config.languages, (language) => {
    titleLanguages[language] = false;
  });
  return titleLanguages;
}

const ContactModal = ({
  isOpen,
  onClose,
  onCreateContact,
  onEditContact,
  contactInfo,
  organizations,
}) => {
  const intl = useIntl();

  const [contact, setContact] = useState({
    id: contactInfo.id || '',
    name: contactInfo.name || '',
    phone: contactInfo.phone || '',
    email: contactInfo.email || '',
    title: contactInfo.title || {},
    organization: contactInfo.organization || '',
    additional_info: contactInfo.additional_info || '',
  });

  const [titleLanguages, setTitleLanguages] = useState(() => ({
    ...initializeLanguages(),
    fi: true,
  }));

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const newTitleLanguages = {};
    forEach(contactInfo.title, (title, language) => {
      newTitleLanguages[language] = !isEmpty(title);
    });
    setTitleLanguages(
      isEmpty(newTitleLanguages) ? initializeLanguages() : newTitleLanguages
    );
    setContact({
      id: contactInfo.id || '',
      name: contactInfo.name || '',
      phone: contactInfo.phone || '',
      email: contactInfo.email || '',
      organization: contactInfo.organization || '',
      additional_info: contactInfo.additional_info || '',
      title: contactInfo.title || {},
    });
  }, [contactInfo, organizations]);

  const onContactChange = (field, value) => {
    setContact((prev) =>
      update(prev, {
        [field]: { $set: value },
      })
    );
  };

  const onContactTitleChange = (language, value) => {
    setContact((prev) =>
      update(prev, {
        title: { [language]: { $set: value } },
      })
    );
  };

  const onActiveLanguageChange = (language) => {
    setTitleLanguages((prev) =>
      update(prev, {
        [language]: { $set: !prev[language] },
      })
    );
  };

  const submitForm = async (event) => {
    event.preventDefault();
    let success = false;
    if (isEmpty(contactInfo)) {
      success = await onCreateContact(omit(contact, ['id']));
    } else {
      const omittedLanguages = [];
      forEach(titleLanguages, (value, key) => {
        if (!value) omittedLanguages.push(key);
      });
      const updatedContact = update(contact, {
        title: { $unset: omittedLanguages },
      });
      success = await onEditContact(updatedContact);
    }
    if (!success) return;
    setContact({
      id: '',
      name: '',
      phone: '',
      email: '',
      organization: '',
      additional_info: '',
      title: {},
    });
    setTitleLanguages(initializeLanguages());
    onClose();
  };

  const checkBoxes = map(config.languages, (language) => (
    <div key={language} className='checkbox-container'>
      <FormattedMessage id={`inLanguage-${language}`} />
      <input
        type='checkbox'
        checked={titleLanguages[language]}
        onChange={() => onActiveLanguageChange(language)}
      />
    </div>
  ));

  const titleInputs = [];
  forEach(titleLanguages, (active, key) => {
    if (active) {
      titleInputs.push(
        <div key={key} className='title-input-container'>
          <label className='form-label' htmlFor={`contact-title-${key}`}>
            <FormattedMessage id={`inLanguage-${key}`} />
          </label>
          <input
            id={`contact-title-${key}`}
            className='form-control'
            onChange={(event) => onContactTitleChange(key, event.target.value)}
            value={contact.title[key] || ''}
            placeholder={intl.formatMessage({ id: 'contactTitlePlaceholder' })}
            maxLength='250'
          />
        </div>
      );
    }
  });

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
        title={
          isCreate ? (
            <FormattedMessage id='createContact' />
          ) : (
            <FormattedMessage id='editContact' />
          )
        }
      />
      <Dialog.Content>
        <form id={descriptionId} onSubmit={submitForm}>
          <div className='input-container name-input'>
            <h4>
              <FormattedMessage id='name' />
            </h4>
            <input
              className='form-control'
              onChange={(event) => onContactChange('name', event.target.value)}
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
              onChange={(event) => onContactChange('phone', event.target.value)}
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
              onChange={(event) => onContactChange('email', event.target.value)}
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
            <div className='title-checkboxes'>{checkBoxes}</div>
            <div className='title-inputs'>{titleInputs}</div>
          </div>
          <div className='input-container'>
            <h4>
              <FormattedMessage id='organization' />
            </h4>
            <Select
              label='Organisaatio'
              placeholder='Organisaatio'
              onChange={(selected) =>
                onContactChange('organization', selected[0].value)
              }
              options={organizations.map((org) => ({
                label: `${org.name} ${org.external_organization ? '*' : ''}`,
                value: org.name,
              }))}
              value={contact.organization}
              disabled={!isEmpty(contactInfo)}
            />
            <small className='form-text text-muted'>
              <FormattedMessage id='contactPersonOrganizationHelpText' />
            </small>
          </div>
          <div className='input-container'>
            <h4>
              <FormattedMessage id='additionalInfo' />
            </h4>
            <input
              className='form-control'
              onChange={(event) =>
                onContactChange('additional_info', event.target.value)
              }
              value={contact.additional_info}
              placeholder='Lisätiedot yhteyshenkilöstä'
              maxLength='50'
            />
            <small className='form-text text-muted'>
              <FormattedMessage id='contactPersonAdditionalInfoHelpText' />
            </small>
          </div>
          <input type='submit' style={{ display: 'none' }} />{' '}
          {/* Used to trigger submit remotely. */}
        </form>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button className='kerrokantasi-btn black' onClick={submitForm}>
          {isCreate ? (
            <FormattedMessage id='create' />
          ) : (
            <FormattedMessage id='save' />
          )}
        </Button>
        <Button className='kerrokantasi-btn' onClick={onClose}>
          <FormattedMessage id='cancel' />
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

ContactModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateContact: PropTypes.func,
  onEditContact: PropTypes.func,
  contactInfo: PropTypes.object,
  organizations: PropTypes.arrayOf(organizationShape),
};

export default ContactModal;
