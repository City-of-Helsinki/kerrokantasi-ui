import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Select, TextInput } from 'hds-react';
import { connect, useDispatch } from 'react-redux';

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import LabelModal from './LabelModal';
import ContactModal from './ContactModal';
import {
  contactShape,
  hearingShape,
  labelShape,
  organizationShape,
} from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import {
  addLabel,
  addContact,
  saveContact,
  fetchHearingEditorContactPersons,
} from '../../actions/hearingEditor';
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

  const getItemId = (item) =>
    typeof item === 'object' && item !== null ? item.id : item;

  const [showLabelModal, setShowLabelModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const selectedLabelIds = (hearing?.labels || [])
    .map(getItemId)
    .filter(Boolean);
  const selectedContactIds = (hearing?.contact_persons || [])
    .map(getItemId)
    .filter(Boolean);

  const getLabelSelectValue = () =>
    (hearing.labels || [])
      .map((item) => {
        const option =
          typeof item === 'object'
            ? item
            : labelOptions.find((label) => label.id === item);

        if (!option) {
          return null;
        }

        return {
          value: option.id,
          title: getAttr(option.label, language),
          label: getAttr(option.label, language),
        };
      })
      .filter(Boolean);

  const getContactSelectValue = () =>
    (hearing.contact_persons || [])
      .map((item) => {
        const option =
          typeof item === 'object'
            ? item
            : contactPersons.find((person) => person.id === item);

        if (!option) {
          return null;
        }

        return {
          value: option.id,
          label: option.name,
        };
      })
      .filter(Boolean);

  const onLabelsChange = (labels = []) => {
    const newLabels = labelOptions.filter((item) =>
      labels.some((label) => item.id === label.value)
    );
    onHearingChange(
      'labels',
      newLabels.map(({ id }) => id)
    );
  };

  const onContactsChange = (contacts = []) => {
    const newContacts = contactPersons.filter((item) =>
      contacts.some((contact) => item.id === contact.value)
    );
    onHearingChange(
      'contact_persons',
      newContacts.map(({ id }) => id)
    );
  };

  const onCreateLabel = (label) => {
    dispatch(addLabel(label, selectedLabelIds));
  };

  const onCreateContact = async (contact) => {
    try {
      await dispatch(addContact(contact, selectedContactIds));
      await dispatch(fetchHearingEditorContactPersons());
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  };

  const onEditContact = async (contact) => {
    try {
      await dispatch(saveContact(contact));
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
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
      <HearingLanguages
        hearingLanguages={hearingLanguages}
        onChange={onLanguagesChange}
      />
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
          <Select
            multiSelect
            name='labels'
            filter={(option, inputValue) => {
              const label =
                typeof option.label === 'string'
                  ? option.label.toLowerCase()
                  : option.label.toString();
              return label.includes(inputValue.toLowerCase());
            }}
            value={getLabelSelectValue()}
            onChange={onLabelsChange}
            options={labelOptions.map((opt) => ({
              value: opt.id,
              title: getAttr(opt.label, language),
              label: getAttr(opt.label, language),
            }))}
            texts={{
              placeholder: intl.formatMessage({
                id: 'hearingLabelsPlaceholder',
              }),
              label: intl.formatMessage({ id: 'hearingLabels' }),
            }}
            required
            invalid={!!errors.labels}
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
            value={hearing.slug || ''}
            placeholder={intl.formatMessage({ id: 'hearingSlugPlaceholder' })}
            onChange={(event) => {
              const { value } = event.target;

              onHearingChange('slug', value);
            }}
            required
            invalid={!!errors.slug}
            errorText={errors.slug}
          />
        </div>
      </div>
      <div>
        <div id='hearingContacts' className='hearing-form-column'>
          <Select
            multiSelect
            name='contact_persons'
            onChange={onContactsChange}
            filter={(option, inputValue) => {
              const label =
                typeof option.label === 'string'
                  ? option.label.toLowerCase()
                  : option.label.toString();
              return label.includes(inputValue.toLowerCase());
            }}
            value={getContactSelectValue()}
            options={contactPersons.map((person) => {
              return { value: person.id, label: person.name };
            })}
            texts={{
              placeholder: intl.formatMessage({
                id: 'hearingContactsPlaceholder',
              }),
              label: intl.formatMessage({ id: 'hearingContacts' }),
            }}
            required
            invalid={!!errors.contact_persons}
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
        {selectedContactIds.map((item) => {
          const contact = contactPersons.find((option) => option.id === item);
          if (!contact) return null;
          return (
            <li key={contact.id} className='hearing-contact'>
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
      <LabelModal
        isOpen={showLabelModal}
        onClose={closeLabelModal}
        onCreateLabel={onCreateLabel}
      />
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
