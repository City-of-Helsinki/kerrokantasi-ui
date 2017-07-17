import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Row from 'react-bootstrap/lib/Row';

import HearingLanguages from './HearingLanguages';
import MultiLanguageTextField from '../forms/MultiLanguageTextField';
import TagModal from './TagModal';
import ContactModal from './ContactModal';
import {
  contactShape,
  hearingShape,
  labelShape
} from '../../types';
import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';

import {addTag, addContact} from '../../actions/hearingEditor';

class HearingFormStep1 extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onContactsChange = this.onContactsChange.bind(this);

    this.state = {
      showTagModal: false,
      showContactModal: false,
      selectedTags: this.props.hearing.labels.map(({id}) => id),
      selectedContacts: this.props.hearing.contact_persons.map(({id}) => id)
    };
  }

  onChange(event) {
    if (this.props.onHearingChange) {
      // Propagate interestin changes to parent components
      const {name: field, value} = event.target;
      this.props.onHearingChange(field, value);
    }
  }

  onTagsChange(selectedTags) {
    this.setState({ selectedTags });
    this.props.onHearingChange("labels", selectedTags.map(({id}) => id));
  }

  onContactsChange(selectedContacts) {
    this.setState({ selectedContacts });
    this.props.onHearingChange("contact_persons", selectedContacts.map(({id}) => id));
  }

  onCreateTag(tag) {
    this.props.dispatch(addTag(tag, this.state.selectedTags));
  }

  onCreateContact(contact) {
    this.props.dispatch(addContact(contact, this.state.selectedContacts));
  }

  openTagModal() {
    this.setState({ showTagModal: true });
  }

  closeTagModal() {
    this.setState({ showTagModal: false });
  }

  openContactModal() {
    this.setState({ showContactModal: true });
  }

  closeContactModal() {
    this.setState({ showContactModal: false });
  }

  render() {
    const {
      hearing,
      hearingLanguages,
      intl: {formatMessage},
      labels: tagOptions,
      contactPersons: contactOptions,
      onHearingChange,
      onLanguagesChange,
    } = this.props;
    const {language} = this.context;

    return (
      <div className="form-step">

        <HearingLanguages
          hearingLanguages={hearingLanguages}
          onChange={onLanguagesChange}
        />

        <MultiLanguageTextField
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
            <FormGroup controlId="hearingTags">
              <ControlLabel><FormattedMessage id="hearingTags"/></ControlLabel>
              <div className="tag-elements">
                <Select
                  multi
                  name="labels"
                  onChange={this.onTagsChange}
                  options={tagOptions.map((opt) => ({...opt, label: getAttr(opt.label, language)}))}
                  placeholder={formatMessage({id: "hearingTagsPlaceholder"})}
                  simpleValue={false}
                  value={hearing.labels.map((label) => ({...label, label: getAttr(label.label, language)}))}
                  valueKey="frontId"
                  menuContainerStyle={{zIndex: 10}}
                />
                <Button bsStyle="primary" className="pull-right add-tag-button" onClick={() => this.openTagModal()}>
                  <Icon className="icon" name="plus"/>
                </Button>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="hearingSlug">
              <ControlLabel><FormattedMessage id="hearingSlug"/></ControlLabel>
              <InputGroup>
                <InputGroup.Addon>{`${window.document.origin}/hearing/`}</InputGroup.Addon>
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

        <FormGroup controlId="hearingContacts">
          <ControlLabel><FormattedMessage id="hearingContacts"/></ControlLabel>
          <div className="contact-elements">
            <Select
              labelKey="name"
              multi
              name="contacts"
              onChange={this.onContactsChange}
              options={contactOptions}
              placeholder={formatMessage({id: "hearingContactsPlaceholder"})}
              simpleValue={false}
              value={hearing.contact_persons}
              valueKey="id"
            />
            <Button bsStyle="primary" className="pull-right add-contact-button" onClick={() => this.openContactModal()}>
              <Icon className="icon" name="plus"/>
            </Button>
          </div>
        </FormGroup>
        <hr/>
        <Button bsStyle="primary" className="pull-right" onClick={this.props.onContinue}>
          <FormattedMessage id="hearingFormNext"/>
        </Button>
        <TagModal
          isOpen={this.state.showTagModal}
          close={this.closeTagModal.bind(this)}
          onCreateTag={this.onCreateTag.bind(this)}
        />
        <ContactModal
          isOpen={this.state.showContactModal}
          close={this.closeContactModal.bind(this)}
          onCreateContact={this.onCreateContact.bind(this)}
        />
      </div>
    );
  }
}

HearingFormStep1.propTypes = {
  contactPersons: PropTypes.arrayOf(contactShape),
  dispatch: React.PropTypes.func,
  hearing: hearingShape,
  intl: intlShape.isRequired,
  labels: PropTypes.arrayOf(labelShape),
  onContinue: PropTypes.func,
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string)
};

HearingFormStep1.defaultProps = {
  editorMetaData: {
    contacts: [],
    labels: [],
  },
};

HearingFormStep1.contextTypes = {
  language: PropTypes.string
};

const WrappedHearingFormStep1 = injectIntl(HearingFormStep1);

export default WrappedHearingFormStep1;
