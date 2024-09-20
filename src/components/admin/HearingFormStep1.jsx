/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Combobox, TextInput } from 'hds-react';
import { connect } from 'react-redux';

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import LabelModal from './LabelModal';
import ContactModal from './ContactModal';
import { contactShape, hearingShape, labelShape, organizationShape } from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import { addLabel, addContact, saveContact } from '../../actions/hearingEditor';
import ContactCard from '../ContactCard';

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
    const newLabels = labelOptions.filter((item) => labels.some((label) => item.id === label.id));

    setSelectedLabels(newLabels.map(({ id }) => id));
    onHearingChange(
      'labels',
      newLabels.map(({ id }) => id),
    );
  };

  const onContactsChange = (contacts) => {
    const newContacts = contactPersons.filter((item) => contacts.some((contact) => item.id === contact.id));

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
        hint={
          <>
            200 <FormattedMessage id='characters' />
          </>
        }
        maxLength={200}
        value={hearing.title}
        name='title'
        placeholderId='titlePlaceholder'
        required
      />
      <div className='hearing-form-row'>
        <div id='hearingLabels' className='hearing-form-column'>
          <Combobox
            multiselect
            name='labels'
            defaultValue={hearing.labels.map((opt) => ({
              id: opt.id,
              title: getAttr(opt.label, language),
              label: getAttr(opt.label, language),
            }))}
            onChange={onLabelsChange}
            options={labelOptions.map((opt) => ({
              id: opt.id,
              title: getAttr(opt.label, language),
              label: getAttr(opt.label, language),
            }))}
            placeholder={formatMessage({ id: 'hearingLabelsPlaceholder' })}
            clearButtonAriaLabel='Poista'
            selectedItemRemoveButtonAriaLabel='Poista {value}'
            toggleButtonAriaLabel='Avaa'
            required
            invalid={!!errors.labels}
            error={errors.labels}
            label={<FormattedMessage id='hearingLabels' />}
            id='labels'
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
            multiselect
            name='contact_persons'
            onChange={onContactsChange}
            optionKeyField='id'
            value={hearing.contact_persons.map((person) => ({
              id: person.id,
              title: person.name,
              label: person.name,
            }))}
            options={contactPersons.map((person) => ({ id: person.id, title: person.name, label: person.name }))}
            placeholder={formatMessage({ id: 'hearingContactsPlaceholder' })}
            label={<FormattedMessage id='hearingContacts' />}
            required
            helper={<FormattedMessage id='hearingContactsHelpText' />}
            invalid={!!errors.contact_persons}
            error={errors.contact_persons}
            id='contact_persons'
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

      <ul className='edit-contacts-list hearing-contacts'>
        {selectedContacts &&
          selectedContacts.map((item) => {
            const contact = contactPersons.find((option) => option.id === item);

            return (
              <li className='hearing-contact'>
                <ContactCard {...contact} />
                <Button
                  className='kerrokantasi-btn'
                  variant='supplementary'
                  size='small'
                  onClick={() => openContactModal(contact)}
                  aria-label={`Muokkaa yhteyshenkilöä: ${contact.name}`}
                >
                  <Icon className='icon' name='edit' />
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
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  onContinue: PropTypes.func,
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  organizations: PropTypes.arrayOf(organizationShape),
  intl: PropTypes.object,
};

HearingFormStep1.contextTypes = {
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  language: state.language,
});

export default connect(mapStateToProps, null)(injectIntl(HearingFormStep1));
