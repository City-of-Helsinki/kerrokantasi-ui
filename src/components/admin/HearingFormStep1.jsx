/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Combobox, TextInput } from 'hds-react';
import { connect, useDispatch } from 'react-redux';

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import LabelModal from './LabelModal';
import ContactModal from './ContactModal';
import { contactShape, hearingShape, labelShape, organizationShape } from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import { addLabel, addContact, saveContact, fetchHearingEditorContactPersons } from '../../actions/hearingEditor';
import ContactCard from '../ContactCard';

const HearingFormStep1 = ({
  contactPersons,
  errors,
  hearing,
  hearingLanguages,
  labels: labelOptions,
  language,
  organizations,
  onHearingChange,
  onLanguagesChange,
  onContinue,
}) => {

  const intl = useIntl();
  const dispatch = useDispatch();

  const [showLabelModal, setShowLabelModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState(
    hearing?.labels?.map(({ id }) => id) || []
  );
  const [selectedContacts, setSelectedContacts] = useState(
    hearing?.contact_persons?.filter(Boolean)?.map((person) => person?.id) || []
  );
  
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
    setSelectedContacts(newContacts.filter(Boolean).map(({ id }) => id));
    onHearingChange(
      'contact_persons',
      newContacts.map(({ id }) => id),
    );
  };

  const onCreateLabel = (label) => {
    dispatch(addLabel(label, selectedLabels));
  };

  const onCreateContact = async (contact) => {
    try {
      await dispatch(addContact(contact, selectedContacts));
      await dispatch(fetchHearingEditorContactPersons());
      return true;
    } catch (error) {
      return false;
    }
  };

  const onEditContact = async (contact) => {
    try { 
      await dispatch(saveContact(contact));
      return true;
    } catch (error) {
      return false
    }
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
            placeholder={intl.formatMessage({ id: 'hearingLabelsPlaceholder' })}
            clearButtonAriaLabel='Poista'
            selectedItemRemoveButtonAriaLabel='Poista {value}'
            toggleButtonAriaLabel='Avaa'
            required
            invalid={!!errors.labels}
            error={errors.labels}
            label={intl.formatMessage({ id: 'hearingLabels' })}
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
            placeholder={intl.formatMessage({ id: 'hearingSlugPlaceholder' })}
            onChange={(value) => onHearingChange('slug', value)}
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
            value={hearing.contact_persons.filter(Boolean).map((person) => ({
              id: person.id,
              title: person.name,
              label: person.name,
            }))}
            options={contactPersons.map((person) => ({ id: person.id, title: person.name, label: person.name }))}
            placeholder={intl.formatMessage({ id: 'hearingContactsPlaceholder' })}
            label={intl.formatMessage({ id: 'hearingContacts' })}
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
            if (!contact) return null;
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
  errors: PropTypes.object,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
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

export default connect(mapStateToProps, null)(HearingFormStep1);
