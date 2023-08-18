import React from 'react';
import PropTypes from 'prop-types';

import getMessage from '../../../utils/getMessage';
import { parseIframeHtml, convertStyleDimensionSettings } from './IframeUtils';


class IframeCopyPasteField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlCopyPaste: '',
    };

    this.handleCopyPasteChange = this.handleCopyPasteChange.bind(this);
  }

  handleCopyPasteChange(event) {
    const {value} = event.target;
    this.setState({htmlCopyPaste: value});

    // if iframe has width and/or height in the style attribute
    // convert the dimensions into their own attributes
    const attributes = convertStyleDimensionSettings(parseIframeHtml(value));
    this.props.updateAttributes(attributes);
  }

  render() {
    return (
      <div className="input-container html-copy-paste-input">
        <label htmlFor="iframe-html-copy-paste">{getMessage("iframeHtmlCopyPaste")}</label>
        <textarea
            id="iframe-html-copy-paste"
            name="htmlCopyPaste"
            className="form-control"
            onChange={this.handleCopyPasteChange}
            value={this.state.htmlCopyPaste}
        />
      </div>
    );
  }
}

IframeCopyPasteField.propTypes = {
  updateAttributes: PropTypes.func,
};

export default IframeCopyPasteField;
