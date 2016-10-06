import React from 'react';
import Select from 'react-select';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Row from 'react-bootstrap/lib/Row';

import TextInput from '../forms/TextInput';
import {hearingShape, hearingEditorMetaDataShape} from '../../types';


class HearingFormStep1 extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onContactsChange = this.onContactsChange.bind(this);
  }

  onChange(event) {
    if (this.props.onHearingChange) {
      // Propagate interestin changes to parent components
      const {name: field, value} = event.target;
      this.props.onHearingChange(field, value);
    }
  }

  onTagsChange(selectedTags) {
    this.props.onHearingChange("labels", selectedTags);
  }

  onContactsChange(selectedContacts) {
    this.props.onHearingChange("contact_persons", selectedContacts);
  }

  render() {
    const hearing = this.props.hearing;
    const {formatMessage} = this.props.intl;
    const tagOptions = this.props.editorMetaData.labels || [];
    const contactOptions = this.props.editorMetaData.contacts || [];

    return (
      <div className="form-step">
        <TextInput
          labelId="hearingTitle"
          maxLength={200}
          name="title"
          onBlur={this.onChange}
          placeholderId="hearingTitlePlaceholder"
          value={hearing.title}
        />

        <Row>
          <Col md={6}>
            <FormGroup controlId="hearingTags">
              <ControlLabel>
                <FormattedMessage id="hearingTags"/>
              </ControlLabel>
              <Select
                multi
                name="labels"
                onChange={this.onTagsChange}
                options={tagOptions}
                placeholder={formatMessage({id: "hearingTagsPlaceholder"})}
                simpleValue={false}
                value={hearing.labels}
                valueKey="id"
              />
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
        </FormGroup>
        <hr/>
        <Button bsStyle="primary" className="pull-right" onClick={this.props.onContinue}>
          <FormattedMessage id="hearingFormNext"/>
        </Button>
      </div>
    );
  }
}

HearingFormStep1.propTypes = {
  editorMetaData: hearingEditorMetaDataShape,
  errors: React.PropTypes.object,
  hearing: hearingShape,
  intl: intlShape.isRequired,
  onContinue: React.PropTypes.func,
  onHearingChange: React.PropTypes.func,
};

const WrappedHearingFormStep1 = injectIntl(HearingFormStep1);

export default WrappedHearingFormStep1;
