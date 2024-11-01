/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import map from 'lodash/map';
import { Button, Combobox } from 'hds-react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Row from 'react-bootstrap/lib/Row';
import { HelpBlock } from 'react-bootstrap';
import { connect } from 'react-redux';

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import LabelModal from './LabelModal';
import ContactModal from './ContactModal';
import { contactShape, hearingShape, labelShape, organizationShape } from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import { getDocumentOrigin, getValidationState } from '../../utils/hearingEditor';
import { addLabel, addContact, saveContact } from '../../actions/hearingEditor';
import ContactCard from '../ContactCard';

class HearingFormStep1 extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onLabelsChange = this.onLabelsChange.bind(this);
    this.onContactsChange = this.onContactsChange.bind(this);
    this.onCreateLabel = this.onCreateLabel.bind(this);
    this.onCreateContact = this.onCreateContact.bind(this);
    this.onEditContact = this.onEditContact.bind(this);
    this.closeLabelModal = this.closeLabelModal.bind(this);
    this.openContactModal = this.openContactModal.bind(this);
    this.closeContactModal = this.closeContactModal.bind(this);

    this.state = {
      showLabelModal: false,
      contactInfo: {},
      showContactModal: false,
      selectedLabels: map(this.props.hearing.labels, ({id}) => id),
      selectedContacts: map(this.props.hearing.contact_persons, ({id}) => id),
    };
  }

  onChange(event) {
    if (this.props.onHearingChange) {
      // Propagate interesting changes to parent components
      const { name: field, value } = event.target;
      this.props.onHearingChange(field, value);
    }
  }

  onLabelsChange(selectedLabels) {
    this.setState({ selectedLabels: selectedLabels.map(({id}) => id) });
    this.props.onHearingChange(
      'labels',
      selectedLabels.map(({id}) => id),
    );
  }

  onContactsChange(selectedContacts) {
    this.setState({ selectedContacts: selectedContacts.map(({id}) => id) });
    this.props.onHearingChange(
      'contact_persons',
      selectedContacts.map(({id}) => id),
    );
  }

  onCreateLabel(label) {
    this.props.dispatch(addLabel(label, this.state.selectedLabels));
  }

  onCreateContact(contact) {
    this.props.dispatch(addContact(contact, this.state.selectedContacts));
  }

  onEditContact(contact) {
    this.props.dispatch(saveContact(contact));
  }

  openLabelModal() {
    this.setState({ showLabelModal: true });
  }

  closeLabelModal() {
    this.setState({ showLabelModal: false });
  }

  openContactModal(contactInfo) {
    this.setState({ showContactModal: true, contactInfo });
  }

  closeContactModal() {
    this.setState({ showContactModal: false });
  }

  render() {
    const {
      errors,
      hearing,
      hearingLanguages,
      intl: { formatMessage },
      labels: labelOptions,
      contactPersons: contactOptions,
      onHearingChange,
      onLanguagesChange,
      organizations,
      language,
    } = this.props;

    return (
      <div className='form-step'>
        <HearingLanguages hearingLanguages={hearingLanguages} onChange={onLanguagesChange} />

        <MultiLanguageTextField
          error={errors.title}
          languages={hearingLanguages}
          onBlur={(value) => onHearingChange('title', value)}
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

        <Row>
          <Col md={6}>
            <FormGroup controlId='hearingLabels' validationState={getValidationState(errors, 'labels')}>
              <ControlLabel>
                <FormattedMessage id='hearingLabels'>{(txt) => `${txt}*`}</FormattedMessage>
              </ControlLabel>
              <div className='label-elements'>
                <Combobox
                  style={{flex: 1}}
                  multiselect
                  name='labels'
                  defaultValue={hearing.labels.map((opt) => ({
                    id: opt.id,
                    title: getAttr(opt.label, language),
                    label: getAttr(opt.label, language)
                  }))}
                  onChange={this.onLabelsChange}
                  options={labelOptions.map((opt) => ({
                    id: opt.id,
                    title: getAttr(opt.label, language),
                    label: getAttr(opt.label, language),
                  }))}
                  placeholder={formatMessage({ id: 'hearingLabelsPlaceholder' })}
                />
                <Button
                  size='small'
                  className='kerrokantasi-btn pull-right add-label-button'
                  onClick={() => this.openLabelModal()}
                >
                  <Icon className='icon' name='plus' />
                </Button>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId='hearingSlug' validationState={getValidationState(errors, 'slug')}>
              <ControlLabel>
                <FormattedMessage id='hearingSlug' />*
              </ControlLabel>
              <InputGroup>
                <InputGroup.Addon>{getDocumentOrigin()}</InputGroup.Addon>
                <FormControl
                  type='text'
                  name='slug'
                  defaultValue={hearing.slug}
                  placeholder={formatMessage({ id: 'hearingSlugPlaceholder' })}
                  onBlur={this.onChange}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup controlId='hearingContacts' validationState={getValidationState(errors, 'contact_persons')}>
          <ControlLabel>
            <FormattedMessage id='hearingContacts' />*
          </ControlLabel>
          <div className='contact-elements'>
            <Combobox
              style={{flex: 1}}
              multiselect
              name='contacts'
              onChange={this.onContactsChange}
              optionKeyField='id'
              value={hearing.contact_persons.map((person) => ({
                id: person.id,
                title: person.name,
                label: person.name,
              }))}
              options={contactOptions.map(person => ({
                id: person.id,
                title: person.name,
                label: person.name,
              }))}
              placeholder={formatMessage({ id: 'hearingContactsPlaceholder' })}
            />
            <Button
              size='small'
              className='kerrokantasi-btn pull-right add-contact-button'
              onClick={() => this.openContactModal({})}
            >
              <Icon className='icon' name='plus' />
            </Button>
          </div>
          <HelpBlock>
            <FormattedMessage id='hearingContactsHelpText' />
          </HelpBlock>
          <div className='hearing-contacts'>
            {this.state.selectedContacts.map((contactId) => {
              const contact = contactOptions.find(({id}) => id === contactId);
              return (
              <div className='hearing-contact'>
                <ContactCard {...contact} />
                <Button
                  size='small'
                  className='kerrokantasi-btn'
                  onClick={() => this.openContactModal(contact)}
                >
                  <Icon className='icon' name='edit' />
                </Button>
              </div>);
            })}
          </div>
        </FormGroup>
        <div className='step-footer'>
          <Button className='kerrokantasi-btn' onClick={this.props.onContinue}>
            <FormattedMessage id='hearingFormNext' />
          </Button>
        </div>
        <LabelModal
          isOpen={this.state.showLabelModal}
          onClose={this.closeLabelModal}
          onCreateLabel={this.onCreateLabel}
        />
        <ContactModal
          contactInfo={this.state.contactInfo}
          isOpen={this.state.showContactModal}
          onClose={this.closeContactModal}
          onCreateContact={this.onCreateContact}
          onEditContact={this.onEditContact}
          organizations={organizations}
        />
      </div>
    );
  }
}

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

const WrappedHearingFormStep1 = injectIntl(HearingFormStep1);
export { WrappedHearingFormStep1 as UnconnectedHearingFormStep1 };
export default connect(mapStateToProps, null)(WrappedHearingFormStep1);
