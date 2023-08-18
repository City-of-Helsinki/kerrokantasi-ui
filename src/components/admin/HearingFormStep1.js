import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import map from 'lodash/map';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Row from 'react-bootstrap/lib/Row';
import {HelpBlock} from "react-bootstrap";

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import LabelModal from './LabelModal';
import ContactModal from './ContactModal';
import {
  contactShape,
  hearingShape,
  labelShape,
  organizationShape
} from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import {getDocumentOrigin, getValidationState} from '../../utils/hearingEditor';
import {addLabel, addContact, saveContact} from '../../actions/hearingEditor';

class HearingFormStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onLabelsChange = this.onLabelsChange.bind(this);
    this.onContactsChange = this.onContactsChange.bind(this);

    this.state = {
      showLabelModal: false,
      contactInfo: {},
      showContactModal: false,
      selectedLabels: map(this.props.hearing.labels, ({id}) => id),
      selectedContacts: map(this.props.hearing.contact_persons, ({id}) => id)
    };
  }

  onChange(event) {
    if (this.props.onHearingChange) {
      // Propagate interesting changes to parent components
      const {name: field, value} = event.target;
      this.props.onHearingChange(field, value);
    }
  }

  onLabelsChange(selectedLabels) {
    this.setState({selectedLabels: selectedLabels.map(({id}) => id)});
    this.props.onHearingChange("labels", selectedLabels.map(({id}) => id));
  }

  onContactsChange(selectedContacts) {
    this.setState({ selectedContacts: selectedContacts.map(({id}) => id) });
    this.props.onHearingChange("contact_persons", selectedContacts.map(({id}) => id));
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
      intl: {formatMessage},
      labels: labelOptions,
      contactPersons: contactOptions,
      onHearingChange,
      onLanguagesChange,
      organizations,
    } = this.props;
    const {language} = this.context;

    return (
      <div className="form-step">

        <HearingLanguages
          hearingLanguages={hearingLanguages}
          onChange={onLanguagesChange}
        />

        <MultiLanguageTextField
          error={errors.title}
          languages={hearingLanguages}
          onBlur={(value) => onHearingChange('title', value)}
          labelId="title"
          maxLength={200}
          value={hearing.title}
          name="title"
          placeholderId="titlePlaceholder"
          required
        />

        <Row>
          <Col md={6}>
            <FormGroup controlId="hearingLabels" validationState={getValidationState(errors, 'labels')}>
              <ControlLabel>
                <FormattedMessage id="hearingLabels">{txt => `${txt  }*`}</FormattedMessage>
              </ControlLabel>
              <div className="label-elements">
                <Select
                  multi
                  clearAllText="Poista"
                  clearValueText="Poista"
                  name="labels"
                  onChange={this.onLabelsChange}
                  options={labelOptions
                    .map((opt) => ({...opt, title: getAttr(opt.label, language), label: getAttr(opt.label, language)}))
                  }
                  placeholder={formatMessage({id: "hearingLabelsPlaceholder"})}
                  simpleValue={false}
                  value={hearing.labels
                    .map((label) => ({...label, title: 'Poista', label: getAttr(label.label, language)}))
                  }
                  valueKey="frontId"
                  menuContainerStyle={{zIndex: 10}}
                />
                <Button bsStyle="primary" className="pull-right add-label-button" onClick={() => this.openLabelModal()}>
                  <Icon className="icon" name="plus"/>
                </Button>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="hearingSlug" validationState={getValidationState(errors, 'slug')}>
              <ControlLabel><FormattedMessage id="hearingSlug"/>*</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>{getDocumentOrigin()}</InputGroup.Addon>
                <FormControl
                  type="text"
                  name="slug"
                  defaultValue={hearing.slug}
                  placeholder={formatMessage({id: "hearingSlugPlaceholder"})}
                  onBlur={this.onChange}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup controlId="hearingContacts" validationState={getValidationState(errors, 'contact_persons')}>
          <ControlLabel><FormattedMessage id="hearingContacts"/>*</ControlLabel>
          <div className="contact-elements">
            <Select
              valueRenderer={(options) => (
                <span style={{cursor: 'pointer'}} onMouseDown={() => { this.openContactModal(options); }}>
                  {options.name}
                </span>
              )}
              labelKey="name"
              multi
              name="contacts"
              onChange={this.onContactsChange}
              options={contactOptions}
              placeholder={formatMessage({id: "hearingContactsPlaceholder"})}
              simpleValue={false}
              value={hearing.contact_persons.map(person => ({...person}))}
              valueKey="id"
            />
            <Button
              bsStyle="primary"
              className="pull-right add-contact-button"
              onClick={() => this.openContactModal({})}
            >
              <Icon className="icon" name="plus"/>
            </Button>
          </div>
          <HelpBlock><FormattedMessage id="hearingContactsHelpText"/></HelpBlock>
        </FormGroup>
        <div className="step-footer">
          <Button bsStyle="default" onClick={this.props.onContinue}>
            <FormattedMessage id="hearingFormNext"/>
          </Button>
        </div>
        <LabelModal
          isOpen={this.state.showLabelModal}
          onClose={this.closeLabelModal.bind(this)}
          onCreateLabel={this.onCreateLabel.bind(this)}
        />
        <ContactModal
          contactInfo={this.state.contactInfo}
          isOpen={this.state.showContactModal}
          onClose={this.closeContactModal.bind(this)}
          onCreateContact={this.onCreateContact.bind(this)}
          onEditContact={this.onEditContact.bind(this)}
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
  intl: intlShape.isRequired,
  labels: PropTypes.arrayOf(labelShape),
  onContinue: PropTypes.func,
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  organizations: PropTypes.arrayOf(organizationShape),
};

HearingFormStep1.contextTypes = {
  language: PropTypes.string
};

const WrappedHearingFormStep1 = injectIntl(HearingFormStep1);

export default WrappedHearingFormStep1;
