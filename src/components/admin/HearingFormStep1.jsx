/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Button, Combobox, IconPen, TextInput } from 'hds-react';
import { connect } from 'react-redux';

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import LabelModal from './LabelModal';
import ContactModal from './ContactModal';
import { contactShape, hearingShape, labelShape, organizationShape } from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import { addLabel, addContact, saveContact } from '../../actions/hearingEditor';

const HearingFormStep1 = ({
  contactPersons,
  errors,
  hearing,
  hearingLanguages,
  intl: { formatMessage },
  labels: labelOptions,
  language,
  dispatch,
  organizations,
  onHearingChange,
  onLanguagesChange,
  onContinue,
}) => {
  const selectedLabelsInitialState = hearing.labels.map(({ id }) => id);
  const selectedContactsInitialState = hearing.contact_persons.map(({ id }) => id);

  const [showLabelModal, setShowLabelModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState(selectedLabelsInitialState);
  const [selectedContacts, setSelectedContacts] = useState(selectedContactsInitialState);

  const onChange = (event) => {
    // Propagate interesting changes to parent components
    const { name: field, value } = event.target;
    onHearingChange(field, value);
  };

  const onLabelsChange = (labels) => {
    const newLabels = labelOptions.filter((item) => labels.some((label) => item.id === label.value));

    setSelectedLabels(newLabels.map(({ id }) => id));
    onHearingChange(
      'labels',
      newLabels.map(({ id }) => id),
    );
  };

  const onContactsChange = (contacts) => {
    const newContacts = contactPersons.filter((item) => contacts.some((contact) => item.id === contact.value));

    setSelectedContacts(newContacts.map(({ id }) => id));
    onHearingChange(
      'contact_persons',
      newContacts.map(({ id }) => id),
    );
  };

  const onCreateLabel = (label) => {
    dispatch(addLabel(label, selectedLabels));
  };

  const onCreateContact = (contact) => {
    dispatch(addContact(contact, selectedContacts));
  };

  const onEditContact = (contact) => {
    dispatch(saveContact(contact));
  };

  const openLabelModal = () => {
    setShowLabelModal(true);
  };

  const closeLabelModal = () => {
    setShowLabelModal(false);
  };

  const openContactModal = (data) => {
    setShowContactModal(true);
    setContactInfo(data);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  return (
    <div className='form-step'>
      <HearingLanguages hearingLanguages={hearingLanguages} onChange={onLanguagesChange} />

      <MultiLanguageTextField
        error={errors.title}
        languages={hearingLanguages}
        onBlur={(value) => onHearingChange('title', value)}
        onChange={(value) => onHearingChange('title', value)}
        labelId='title'
        maxLength={200}
        value={hearing.title}
        name='title'
        placeholderId='titlePlaceholder'
        required
      />
      <div className='hearing-form-row'>
        <div id='hearingLabels' className='hearing-form-column'>
          <Combobox
            id='labels'
            name='labels'
            label={<FormattedMessage id='hearingLabels' />}
            multiselect
            clearButtonAriaLabel='Poista'
            selectedItemRemoveButtonAriaLabel='Poista {value}'
            toggleButtonAriaLabel='Avaa'
            onChange={onLabelsChange}
            options={labelOptions.map((opt) => ({
              value: opt.id,
              label: getAttr(opt.label, language),
            }))}
            placeholder={formatMessage({ id: 'hearingLabelsPlaceholder' })}
            value={hearing.labels.map((label) => ({
              value: label.id,
              label: getAttr(label.label, language),
            }))}
            required
            invalid={!!errors.labels}
            error={errors.labels}
          />
          <Button
            size='small'
            className='kerrokantasi-btn pull-right action-button'
            onClick={() => openLabelModal()}
            data-testid='add-new-label'
          >
            <Icon className='icon' name='plus' />
          </Button>
        </div>
        <div id='hearingSlug'>
          <TextInput
            id='slug'
            name='slug'
            label={<FormattedMessage id='hearingSlug' />}
            value={hearing.slug}
            placeholder={formatMessage({ id: 'hearingSlugPlaceholder' })}
            onChange={onChange}
            required
            invalid={!!errors.slug}
            errorText={errors.slug}
          />
        </div>
      </div>
      <div>
        <div id='hearingContacts' className='hearing-form-column'>
          <Combobox
            id='contact_persons'
            name='contact_persons'
            label={<FormattedMessage id='hearingContacts' />}
            required
            onChange={onContactsChange}
            options={contactPersons.map((person) => ({ label: person.name, value: person.id }))}
            placeholder={formatMessage({ id: 'hearingContactsPlaceholder' })}
            value={hearing.contact_persons.map((person) => ({
              label: person.name,
              value: person.id,
            }))}
            helper={<FormattedMessage id='hearingContactsHelpText' />}
            multiselect
            invalid={!!errors.contact_persons}
            error={errors.contact_persons}
          />
          <Button
            size='small'
            className='kerrokantasi-btn pull-right action-button'
            onClick={() => openContactModal({})}
            data-testid='add-new-contact'
          >
            <Icon className='icon' name='plus' />
          </Button>
        </div>
      </div>

      <ul className='edit-contacts-list'>
        {selectedContacts &&
          selectedContacts.map((item) => {
            const contact = contactPersons.find((option) => option.id === item);

            return (
              <li>
                <Button
                  variant='supplementary'
                  iconRight={<IconPen />}
                  size='small'
                  onClick={() => openContactModal(contact)}
                >
                  Muokkaa yhteyshenkilöä: {contact.name}
                </Button>
              </li>
            );
          })}
      </ul>
      <div className='step-footer'>
        <Button className='kerrokantasi-btn' onClick={onContinue}>
          <FormattedMessage id='hearingFormNext' />
        </Button>
      </div>
      <LabelModal isOpen={showLabelModal} onClose={closeLabelModal} onCreateLabel={onCreateLabel} />
      <ContactModal
        contactInfo={contactInfo}
        isOpen={showContactModal}
        onClose={closeContactModal}
        onCreateContact={onCreateContact}
        onEditContact={onEditContact}
        organizations={organizations}
      />
    </div>
  );
};

HearingFormStep1.propTypes = {
  contactPersons: PropTypes.arrayOf(contactShape),
  dispatch: PropTypes.func,
  errors: PropTypes.object,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  onContinue: PropTypes.func,
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  organizations: PropTypes.arrayOf(organizationShape),
};

HearingFormStep1.contextTypes = {
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  language: state.language,
});

export default connect(mapStateToProps, null)(injectIntl(HearingFormStep1));
