import Icon from '../../utils/Icon';
import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {get} from 'lodash';

import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Image from 'react-bootstrap/lib/Image';

import Dropzone from 'react-dropzone';

import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import {sectionShape} from '../../types';
import {isSpecialSectionType} from '../../utils/section';


class SectionForm extends React.Component {

  constructor(props) {
    super(props);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /**
   * Modify section state and propagate necessary information
   * up to the parent components.
   * @param  {object} - OnClick event
   */
  onChange(event) {
    // Propagate interestin changes to parent components
    const {name: field, value} = event.target;
    const section = this.props.section;
    switch (field) {
      case "imageCaption":
        this.props.onSectionImageChange(section.frontId, "caption", value);
        break;
      default:
        this.props.onSectionChange(section.frontId, field, value);
    }
  }

  onFileDrop(files) {
    const section = this.props.section;
    const file = files[0];  // Only one file is supported for now.
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      if (this.props.onSectionImageChange) {
        this.props.onSectionImageChange(section.frontId, "image", fileReader.result);
      }
      this.setState({image: fileReader.result});
    }, false);
    fileReader.readAsDataURL(file);
  }

  getImagePreview() {
    if (this.getImage()) {
      return (<Image className="preview" src={this.getImage()} responsive />);
    }
    return false;
  }

  getImage() {
    const images = this.props.section.images;
    if (images && images.length) {
      // Image property may contain the base64 encoded image
      return images[0].image || images[0].url;
    }
    return "";
  }

  static getImageCaption(section) {
    return get(section.images, '[0].caption', {});
  }

  render() {
    const {section, onSectionChange, onSectionImageChange, sectionLanguages} = this.props;
    const {language} = this.context;
    const imageCaption = SectionForm.getImageCaption(section, language);
    const dropZoneClass = this.getImage() ? "dropzone preview" : "dropzone";
    const {formatMessage} = this.props.intl;

    return (
      <div className="form-step">
        <FormGroup controlId="image">

          {
            !isSpecialSectionType(section.type) ?
              <MultiLanguageTextField
                labelId="sectionTitle"
                name="title"
                onBlur={(value) => onSectionChange(section.frontId, 'title', value)}
                value={section.title}
                languages={sectionLanguages}
              /> : null
          }

          <ControlLabel><FormattedMessage id="sectionImage"/></ControlLabel>
          <Dropzone
            accept="image/*"
            className={dropZoneClass}
            multiple={false}
            onDrop={this.onFileDrop}
          >
            {this.getImagePreview()}
            <div className="overlay">
              <span className="text">
                <FormattedMessage id="selectOrDropImage"/>
                <Icon className="icon" name="upload"/>
              </span>
            </div>
          </Dropzone>
          <HelpBlock><FormattedMessage id="sectionImageHelpText"/></HelpBlock>
        </FormGroup>

        <MultiLanguageTextField
          labelId="sectionImageCaption"
          name="imageCaption"
          onBlur={(value) => onSectionImageChange(section.frontId, 'caption', value)}
          value={imageCaption}
          languages={sectionLanguages}
        />

        <MultiLanguageTextField
          labelId="sectionAbstract"
          maxLength={this.props.maxAbstractLength}
          name="abstract"
          onBlur={(value) => onSectionChange(section.frontId, 'abstract', value)}
          value={section.abstract}
          languages={sectionLanguages}
          fieldType={TextFieldTypes.TEXTAREA}
        />

        <MultiLanguageTextField
          richTextEditor
          labelId="sectionContent"
          name="content"
          onBlur={(value) => onSectionChange(section.frontId, 'content', value)}
          rows="10"
          value={section.content}
          languages={sectionLanguages}
          fieldType={TextFieldTypes.TEXTAREA}
        />

        <FormGroup controlId="hearingCommenting">
          <ControlLabel><FormattedMessage id="hearingCommenting"/></ControlLabel>
          <FormControl
            componentClass="select"
            name="commenting"
            onChange={this.onChange}
          >
            <option value="none">{formatMessage({id: "noCommenting"})}</option>
            <option value="registered">{formatMessage({id: "registeredUsersOnly"})}</option>
            <option value="open">{formatMessage({id: "openCommenting"})}</option>
          </FormControl>
        </FormGroup>

      </div>
    );
  }
}

SectionForm.defaultProps = {
  maxAbstractLength: 450
};

SectionForm.propTypes = {
  intl: intlShape.isRequired,
  maxAbstractLength: PropTypes.number,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  section: sectionShape,
  sectionLanguages: PropTypes.arrayOf(PropTypes.string),
};

SectionForm.contextTypes = {
  language: PropTypes.string
};

const WrappedSectionForm = injectIntl(SectionForm);

export default WrappedSectionForm;
